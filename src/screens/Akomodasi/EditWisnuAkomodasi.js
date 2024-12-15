import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button,StatusBar, TouchableOpacity, Modal, ScrollView, Alert, useWindowDimensions } from 'react-native';
import axios from 'axios';
import { Calendar } from 'react-native-calendars';
import { format } from 'date-fns';
import { URL } from '../../URL';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const EditWisnuAkomodasi = ({ route }) => {
  const { token, akomodasiId, tanggalKunjungan } = route.params; // Get akomodasi_id and tanggal_kunjungan from route params
  const { width, height } = useWindowDimensions(); // Get screen dimensions
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    akomodasi_id: akomodasiId,
    tanggal_kunjungan: tanggalKunjungan,
    kelompok_kunjungan_id: [],
    jumlah_laki_laki: [],
    jumlah_perempuan: [],
    wismannegara_id: [],
    jml_wisman_laki: [],
    jml_wisman_perempuan: [],
  });

  const [apiData, setApiData] = useState(null);
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [date, setDate] = useState(tanggalKunjungan);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // This hides the header
    });
  }, [navigation]);
  useEffect(() => {
    axios
      .get(`${URL}/api/v1/kunjunganakomodasi/edit/${akomodasiId}/${tanggalKunjungan}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data.data;
        if (data) {
          setApiData(data);
          setFormData((prev) => ({
            ...prev,
            akomodasi_id: data.akomodasi_id,
            tanggal_kunjungan: data.tanggal_kunjungan,
            kelompok_kunjungan_id: data.wisnuData ? Object.keys(data.wisnuData).map(key => data.wisnuData[key].kelompok_kunjungan_id) : [],
            jumlah_laki_laki: data.wisnuData ? Object.keys(data.wisnuData).map(key => data.wisnuData[key].jumlah_laki_laki) : [],
            jumlah_perempuan: data.wisnuData ? Object.keys(data.wisnuData).map(key => data.wisnuData[key].jumlah_perempuan) : [],
            wismannegara_id: data.wismanData ? Object.keys(data.wismanData).map(key => data.wismanData[key].wismannegara_id) : [],
            jml_wisman_laki: data.wismanData ? Object.keys(data.wismanData).map(key => data.wismanData[key].jml_wisman_laki) : [],
            jml_wisman_perempuan: data.wismanData ? Object.keys(data.wismanData).map(key => data.wismanData[key].jml_wisman_perempuan) : [],
          }));
          setDate(data.tanggal_kunjungan);
        } else {
          console.error('No data found');
        }
      })
      .catch((error) => {
        console.error('Error fetching API data:', error);
      });
  }, [token, akomodasiId, tanggalKunjungan]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSubmit = () => {
    const requestData = {
      akomodasi_id: formData.akomodasi_id,
      tanggal_kunjungan: formData.tanggal_kunjungan,
      kelompok_kunjungan_id: formData.kelompok_kunjungan_id,
      jumlah_laki_laki: formData.jumlah_laki_laki,
      jumlah_perempuan: formData.jumlah_perempuan,
      wismannegara_id: formData.wismannegara_id,
      jml_wisman_laki: formData.jml_wisman_laki,
      jml_wisman_perempuan: formData.jml_wisman_perempuan,
    };

    axios
    .put(`${URL}/api/v1/kunjunganakomodasi/update/${tanggalKunjungan}`, requestData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      const successMessage = response.data.success || 'Data kunjungan berhasil diperbarui.';
      Alert.alert('Success', successMessage, [{ text: 'OK' }]);
    })
    .catch((error) => {
      let errorMessage = 'Terjadi kesalahan. Silakan coba lagi.';
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'Tidak ada respons dari server.';
      } else {
        errorMessage = error.message;
      }
      Alert.alert('Ups', errorMessage, [{ text: 'OK' }]);
    });
};

  const handleInputChange = (field, value, index = null) => {
    if (index !== null) {
      setFormData((prev) => {
        const updatedArray = [...prev[field]];
        updatedArray[index] = value;
        return { ...prev, [field]: updatedArray };
      });
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const formatDateIndonesia = (dateString) => {
    return format(new Date(dateString), 'yyyy-MM-dd');
  };

  if (!apiData) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
        <StatusBar hidden />
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kunjungan Akomodasi</Text>
      </View>
      <Text style={styles.title}>Ubah Kunjungan {apiData.akomodasi}</Text>

      <View style={styles.tabletgl}>
        <View style={styles.tableRow}>
          <Text style={styles.label}>Tanggal Kunjungan</Text>
          <TouchableOpacity onPress={() => setCalendarVisible(true)}>
            <Text style={styles.labeltgl}>
              {date ? format(new Date(date), 'yyyy-MM-dd') : 'Pilih tanggal'}
            </Text>
          </TouchableOpacity>

          <Modal visible={isCalendarVisible} animationType="slide">
            <View style={styles.modalContent}>
              <Calendar
                onDayPress={(day) => {
                  setDate(day.dateString);
                  setCalendarVisible(false);
                  handleInputChange('tanggal_kunjungan', day.dateString);
                }}
                markedDates={{
                  [date]: { selected: true, marked: true, selectedColor: '#ed6f34' },
                }}
              />
            </View>
          </Modal>
        </View>
      </View>

      <Text style={styles.subtitle}>Nusantara</Text>
      <View style={styles.table}>
        {apiData.wisnuData && Object.keys(apiData.wisnuData).map((key, index) => {
          const kelompok = apiData.wisnuData[key];
          return (
            <View key={kelompok.kelompok_kunjungan_id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{kelompok.kelompok_kunjungan_name}</Text>
              <TextInput
                style={styles.tableInput}
                placeholder="Laki-laki"
                keyboardType="numeric"
                value={formData.jumlah_laki_laki[index]?.toString() || ''}
                onChangeText={(value) => handleInputChange('jumlah_laki_laki', value, index)}
              />
              <TextInput
                style={styles.tableInput}
                placeholder="Perempuan"
                keyboardType="numeric"
                value={formData.jumlah_perempuan[index]?.toString() || ''}
                onChangeText={(value) => handleInputChange('jumlah_perempuan', value, index)}
              />
            </View>
          );
        })}
      </View>

      <Text style={styles.subtitle}>Mancanegara</Text>
      <View style={styles.table}>
        {apiData.wismanData && Object.keys(apiData.wismanData).map((key, index) => {
          const wisman = apiData.wismanData[key];
          return (
            <View key={wisman.wismannegara_id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{wisman.wismannegara_name}</Text>
              <TextInput
                style={styles.tableInput}
                placeholder="Laki-laki"
                keyboardType="numeric"
                value={formData.jml_wisman_laki[index]?.toString() || ''}
                onChangeText={(value) => handleInputChange('jml_wisman_laki', value, index)}
              />
              <TextInput
                style={styles.tableInput}
                placeholder="Perempuan"
                keyboardType="numeric"
                value={formData.jml_wisman_perempuan[index]?.toString() || ''}
                onChangeText={(value) => handleInputChange('jml_wisman_perempuan', value, index)}
              />
            </View>
          );
        })}
      </View>
      <Button title="Simpan" onPress={handleSubmit} color="#ed6f34" />

    </ScrollView>
  );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3a696c',
        padding: 15,
      },
      backButton: {
        marginRight: 10,
      },
      headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
      },
      loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 1,
  },
  labeltgl: {
    fontSize: 16,
    marginBottom: 1,
    paddingLeft: 20,
    color: '#ed6f34',
  },
  table: {
    marginBottom: 10,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 5,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#d9d9d9',
  },
  tableCell: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
    padding: 5,
    borderWidth: 0,
    borderColor: '#ccc',
  },
  tableInput: {
    flex: 1,
    fontSize: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginLeft: 5,
    textAlign: 'center',
  },
  modalContent: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
});

export default EditWisnuAkomodasi;
