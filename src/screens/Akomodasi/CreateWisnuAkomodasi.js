import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TextInput, Image, StyleSheet, Button,StatusBar, TouchableOpacity, Modal, ScrollView, Alert, useWindowDimensions } from 'react-native';
import axios from 'axios';
import { Calendar } from 'react-native-calendars';
import { format } from 'date-fns';
import { URL } from '../../URL';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TabBarAkomodasi from '../Akomodasi/TabBarAkomodasi';

const CreateWisnuAkomodasi = ({ route }) => {
  const { token } = route.params;
  const { width, height } = useWindowDimensions(); // Get screen dimensions
  const [formData, setFormData] = useState({
    akomodasi_id: null,
    tanggal_kunjungan: '',
    kelompok_kunjungan_id: [],
    jumlah_laki_laki: [],
    jumlah_perempuan: [],
    wismannegara_id: [],
    jml_wisman_laki: [],
    jml_wisman_perempuan: [],
  });
  const navigation = useNavigation(); 
  const [apiData, setApiData] = useState(null);
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [date, setDate] = useState('');
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // This hides the header
    });
  }, [navigation]);
  const handleGoBack = () => {
    navigation.goBack();
  };
  useEffect(() => {
    axios
      .get(`${URL}/api/v1/kunjungan/create-wisnuakomodasi`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setApiData(response.data.data);
        setFormData((prev) => ({
          ...prev,
          akomodasi_id: response.data.data.akomodasi_id,
          tanggal_kunjungan: response.data.data.tanggal,
          kelompok_kunjungan_id: response.data.data.kelompok.map((kelompok) => kelompok.id),
          wismannegara_id: response.data.data.wismannegara.map((wisman) => wisman.id),
        }));
      })
      .catch((error) => {
        console.error('Error fetching API data:', error);
      });
  }, [token]);

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
      .post(`${URL}/api/v1/kunjungan/store-wisnuakomodasi`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        Alert.alert('Success', response.data.message, [{ text: 'OK' }]);
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
  <Image
    source={require("../../assets/left.png")}
    style={{ width: 25, height: 25 }} // Set the size to 25
  />
</TouchableOpacity>
        <Text style={styles.headerTitle}>Tambah Kunjungan {apiData.akomodasi}</Text>
      </View>

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
        {apiData.kelompok.map((kelompok, index) => (
          <View key={kelompok.id} style={styles.tableRow}>
            <Text style={styles.tableCell}>{kelompok.kelompokkunjungan_name}</Text>
            <TextInput
              style={styles.tableInput}
              placeholder="Laki-laki"
              keyboardType="numeric"
              value={formData.jumlah_laki_laki[index] || ''}
              onChangeText={(value) => handleInputChange('jumlah_laki_laki', value, index)}
            />
            <TextInput
              style={styles.tableInput}
              placeholder="Perempuan"
              keyboardType="numeric"
              value={formData.jumlah_perempuan[index] || ''}
              onChangeText={(value) => handleInputChange('jumlah_perempuan', value, index)}
            />
          </View>
        ))}
      </View>

      <Text style={styles.subtitle}>Mancanegara</Text>
      <View style={styles.table}>
        {apiData.wismannegara.map((wisman, index) => (
          <View key={wisman.id} style={styles.tableRow}>
            <Text style={styles.tableCell}>{wisman.wismannegara_name}</Text>
            <TextInput
              style={styles.tableInput}
              placeholder="Laki-laki"
              keyboardType="numeric"
              value={formData.jml_wisman_laki[index] || ''}
              onChangeText={(value) => handleInputChange('jml_wisman_laki', value, index)}
            />
            <TextInput
              style={styles.tableInput}
              placeholder="Perempuan"
              keyboardType="numeric"
              value={formData.jml_wisman_perempuan[index] || ''}
              onChangeText={(value) => handleInputChange('jml_wisman_perempuan', value, index)}
            />
          </View>
        ))}
      </View>
      <Button title="Simpan" onPress={handleSubmit} color="#ed6f34" />

    </ScrollView>
    
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ed6f34',
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
    backgroundColor: '#fff',
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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

export default CreateWisnuAkomodasi;
