import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import Barchart from '../screens/Kuliner/Barchart';
import TotalKeseluruhanCard from '../screens/Kuliner/TotalKeseluruhanCard';
import TabBarKuliner from '../screens/Kuliner/TabBarKuliner';
import Piechart from '../screens/Kuliner/Piechart';
import axios from 'axios';
import { URL } from '../URL';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KulinerDashboard = ({ navigation }) => {
  const [year, setYear] = useState('');
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const years = [
    { title: '2022' },
    { title: '2023' },
    { title: '2024' },
    { title: '2025' },
    { title: '2026' },
  ];

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
        `${URL}/api/v1/kunjungan/dashboardkuliner?year=${year}`,
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

  // Fungsi untuk refresh data
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  }, [year]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Dropdown Tahun */}
        <View style={styles.inputContainer}>
          <SelectDropdown
            data={years}
            onSelect={(selectedItem) => {
              setYear(selectedItem.title);
              setError('');
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
        <Piechart year={year} />

        {/* Tombol Logout */}
        <View style={styles.logoutContainer}>
          <Button
            title="Logout"
            color="#FF3B30"
            onPress={() => navigation.replace('Login')}
          />
        </View>
      </ScrollView>

      {/* Tab Bar */}
      <TabBarKuliner navigation={navigation} />
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
  inputContainer: {
    marginBottom: 20,
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownButtonStyle: {
    width: '100%',
    height: 50,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 10,
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
  },
  logoutContainer: {
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 20,
  },
});

export default KulinerDashboard;
