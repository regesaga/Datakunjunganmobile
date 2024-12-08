import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, Alert } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import Barchart from '../screens/Akomodasi/Barchart';
import TotalKeseluruhanCard from '../screens/Akomodasi/TotalKeseluruhanCard';
import TabBarAkomodasi from '../screens/Akomodasi/TabBarAkomodasi';
import Piechart from '../screens/Akomodasi/Piechart';
import TabBar from 'fluidbottomnavigation-rn';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AkomodasiDashboard = ({ navigation }) => {
  const [year, setYear] = useState(''); // State untuk input tahun
  const [error, setError] = useState('');

  const years = [
    { title: '2022' },
    { title: '2023' },
    { title: '2024' },
    { title: '2025' },
    { title: '2026' },
  ];

  // Fungsi untuk mengambil data dari API
  const fetchDashboardData = async () => {
    const token = await AsyncStorage.getItem('userToken');

    if (!token) {
      Alert.alert('Error', 'Token tidak ditemukan!');
      return;
    }

    if (!year) {
      setError('Pilih tahun terlebih dahulu');
      return;
    }

    try {
      const response = await axios.get(
        `http://192.168.100.206:8000/api/v1/kunjungan/dashboardakomodasi?year=${year}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data); // Cek data API yang diterima
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Terjadi kesalahan saat mengambil data dari server');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        {/* Dropdown Tahun */}
        <View style={styles.inputContainer}>
          <SelectDropdown
            data={years}
            onSelect={(selectedItem) => {
              setYear(selectedItem.title);
              setError(''); // Hapus error saat tahun diubah
            }}
            renderButton={(selectedItem, isOpen) => (
              <View style={styles.dropdownButtonStyle}>
                
                <Text style={styles.dropdownButtonTxtStyle}>
                  {(selectedItem && selectedItem.title) || 'Pilih Tahun'}
                </Text>
               
              </View>
            )}
            renderItem={(item, isSelected) => (
              <View
                style={{
                  ...styles.dropdownItemStyle,
                  ...(isSelected && { backgroundColor: '#D2D9DF' }),
                }}
              >
                <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
              </View>
            )}
            showsVerticalScrollIndicator={false}
            dropdownStyle={styles.dropdownMenuStyle}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        {/* Display Charts */}
        <TotalKeseluruhanCard year={year} />
        <Barchart year={year} />
          <Piechart year={year} /> {/* Kirim state year ke Piechart */}

        <View style={styles.logoutContainer}>
          <Button title="Logout" color="#FF3B30" onPress={() => navigation.replace('Login')} />
        </View>

        {/* Tombol untuk mengambil data */}
       
      </ScrollView>

      <TabBarAkomodasi navigation={navigation} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    
  },
  inputContainer: {
    marginBottom: 20,
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownButtonStyle: {
    width: '50%',
    height: 50,
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  dropdownButtonArrowStyle: {
    fontSize: 20,
    color: '#333',
  },
  dropdownButtonIconStyle: {
    fontSize: 20,
    marginRight: 8,
    color: '#333',
  },
  dropdownMenuStyle: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
  dropdownItemStyle: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },

  errorText: {
    color: 'red',
    fontSize: 12,
  },
  logoutContainer: {
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 20,
  },
  fetchDataButton: {
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 20,
  },
});

export default AkomodasiDashboard;
