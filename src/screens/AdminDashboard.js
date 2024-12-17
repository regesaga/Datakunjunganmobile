import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, Alert, RefreshControl } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import Barchart from '../screens/Admin/Barchart';
import TotalKeseluruhanCard from '../screens/Admin/TotalKeseluruhanCard';
import Piechart from '../screens/Admin/Piechart';
import TabBarAdmin from '../screens/Admin/TabBarAdmin';
import axios from 'axios';
import { URL } from '../URL';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AggregatedChart from './Admin/AggregatedChart';
import TotalOperatorCard from './Admin/TotalOperatorCard';

const AdminDashboard = ({ navigation }) => {
  const [year, setYear] = useState(''); // State untuk input tahun
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false); // State untuk mengontrol refresh

  const years = [
    { title: '2022' },
    { title: '2023' },
    { title: '2024' },
    { title: '2025' },
    { title: '2026' },
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // This hides the header
    });
  }, [navigation]);

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
        `${URL}/api/v1/kunjungan/dashboardadmin?year=${year}`,
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

  // Fungsi yang dipanggil saat refresh
  const onRefresh = async () => {
    setRefreshing(true); // Mulai status refreshing
    await fetchDashboardData(); // Ambil data baru
    setRefreshing(false); // Akhiri status refreshing
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Dropdown Tahun */}
        <TotalOperatorCard year={year} />

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
        <AggregatedChart year={year} />
        <Barchart year={year} />
        <Piechart year={year} /> {/* Kirim state year ke Piechart */}

        <View style={styles.logoutContainer}>
          <Button title="Logout" color="#FF3B30" onPress={() => navigation.replace('Login')} />
        </View>
      </ScrollView>
      <TabBarAdmin navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    paddingHorizontal: 15,
    paddingVertical: 25,
    alignItems: 'center',
  },
  inputContainer: {
    marginBottom: 25,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownButtonStyle: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  dropdownMenuStyle: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dropdownItemStyle: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  dropdownItemTxtStyle: {
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  logoutContainer: {
    marginTop: 30,
    width: '100%',
    paddingHorizontal: 20,
  },
});

export default AdminDashboard;
