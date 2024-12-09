import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import { Calendar } from 'react-native-calendars';
import { format } from 'date-fns'; // Pastikan untuk mengimpor date-fns untuk format tanggal
import { URL } from '../../URL';

const CreateWisnuAkomodasi = ({ route }) => {
  const { token } = route.params; // Menerima token dari navigasi
  const [formData, setFormData] = useState({
    akomodasi_id: null,
    tanggal_kunjungan: '',
    kelompok_kunjungan_id: [], // Terisi dengan ID kelompok kunjungan
    jumlah_laki_laki: [],
    jumlah_perempuan: [],
    wismannegara_id: [], // Terisi dengan ID akomodasiwan mancanegara
    jml_wisman_laki: [],
    jml_wisman_perempuan: [],
  });

  const [apiData, setApiData] = useState(null); // Menyimpan data API
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [date, setDate] = useState(''); // State for selected date

  useEffect(() => {
    // Fetch data from API
    axios
      .get(`${URL}/api/v1/kunjungan/create-wisnuakomodasi`, {
        headers: {
          Authorization: `Bearer ${token}`, // Sertakan token untuk autentikasi
        },
      })
      .then((response) => {
        setApiData(response.data.data); // Menyimpan data API
        setFormData((prev) => ({
          ...prev,
          akomodasi_id: response.data.data.akomodasi_id,
          tanggal_kunjungan: response.data.data.tanggal, // Default tanggal dari API
          kelompok_kunjungan_id: response.data.data.kelompok.map((kelompok) => kelompok.id), // Set ID kelompok
          wismannegara_id: response.data.data.wismannegara.map((wisman) => wisman.id), // Set ID akomodasiwan mancanegara
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
      .post('${URL}/api/v1/kunjungan/store-wisnuakomodasi', requestData, {
        headers: {
          Authorization: `Bearer ${token}`, // Sertakan token untuk autentikasi
        },
      })
      .then((response) => {
        // Show success alert
        Alert.alert(
          "Success",
          response.data.message, // The success message from the API
          [
            { text: "OK" }
          ]
        );
      })
      .catch((error) => {
        console.error('Error submitting data:', error);

        let errorMessage = 'Terjadi kesalahan. Silakan coba lagi.';
        if (error.response) {
          // Server responded with an error
          errorMessage = error.response.data.message || errorMessage;
        } else if (error.request) {
          // No response received
          errorMessage = 'Tidak ada respons dari server.';
        } else {
          // Error in setting up the request
          errorMessage = error.message;
        }

        // Show error alert
        Alert.alert(
          "Error",
          errorMessage,
          [{ text: "OK" }]
        );
      });
  };

  const handleInputChange = (field, value, index = null) => {
    if (index !== null) {
      // Jika field berupa array, update nilai di index tertentu
      setFormData((prev) => {
        const updatedArray = [...prev[field]];
        updatedArray[index] = value;
        return { ...prev, [field]: updatedArray };
      });
    } else {
      // Update nilai untuk field biasa
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Function to format date to Indonesia format
  const formatDateIndonesia = (dateString) => {
    return format(new Date(dateString), 'Y-M-d'); // Format tanggal menggunakan date-fns
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
      <Text style={styles.title}>Tambah Kunjungan {apiData.akomodasi}</Text>
      <Button title="Simpan" onPress={handleSubmit} />
      <View style={styles.tabletgl}>
        <View style={styles.tableRow}>
          <Text style={styles.label}>Tanggal Kunjungan</Text>
          <TouchableOpacity onPress={() => setCalendarVisible(true)}>
            <Text style={styles.labeltgl}>
              {date ? format(new Date(date), 'Y-M-d') : 'Pilih tanggal'} {/* Menampilkan tanggal */}
            </Text>
          </TouchableOpacity>

          <Modal visible={isCalendarVisible} animationType="slide">
            <View style={styles.modalContent}>
              <Calendar
                onDayPress={(day) => {
                  setDate(day.dateString);
                  setCalendarVisible(false);
                  handleInputChange('tanggal_kunjungan', day.dateString); // Set the selected date in formData
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
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
    paddingLeft:20
  },
  table: {
    marginBottom: 10,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 1,
  },
  tabletgl: {
    marginBottom: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 1,
    marginTop: 15,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    borderBottomWidth: 2.5,
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
    padding: 2,
    borderWidth: 0,
    borderColor: '#ccc',
    borderRadius: 8,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 10,
  },
  modalContent: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
});

export default CreateWisnuAkomodasi;
