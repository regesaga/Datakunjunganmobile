import React from 'react';
import { Alert } from 'react-native';
import TabBar from 'fluidbottomnavigation-rn';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TabBarAkomodasi = ({ navigation }) => {
  const handleTabPress = async (tabIndex) => {
    const token = await AsyncStorage.getItem('userToken'); // Make sure to fetch the token here

    if (tabIndex === 1) { // Indeks tab "Kunjungan"
      if (token) {
        navigation.navigate('KunjunganAkomodasi', { token }); // Navigasi ke halaman KunjunganAkomodasi dengan token
      } else {
        Alert.alert('Error', 'Token tidak ditemukan!');
      }
    } else if (tabIndex === 2) { // Indeks tab "Tambah"
      if (token) {
        navigation.navigate('CreateWisnuAkomodasi', { token }); // Navigasi ke halaman CreateWisnuAkomodasi dengan token
      } else {
        Alert.alert('Error', 'Token tidak ditemukan!');
      }
    } else {
      console.log('Selected tab:', tabIndex);
    }
  };

  return (
    <TabBar
      tabBarStyle={{
        backgroundColor: 'rgba(40, 90, 90, 0.9)',
        zIndex: 10, // Pastikan elemen tidak tertutup
      }}
      onPress={handleTabPress}
      values={[
        { title: 'Dashboard', icon: require('../../assets/news.png') },
        { title: 'Kunjungan', icon: require('../../assets/events.png') },
        { title: 'Tambah', icon: require('../../assets/account.png') },
      ]}
    />
  );
};

export default TabBarAkomodasi;
