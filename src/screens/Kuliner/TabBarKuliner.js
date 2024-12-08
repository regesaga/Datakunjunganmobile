import React from 'react';
import { Alert } from 'react-native';
import TabBar from 'fluidbottomnavigation-rn';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TabBarKuliner = ({ navigation }) => {
  const handleTabPress = async (tabIndex) => {
    if (tabIndex === 2) { // Indeks tab "Tambah"
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        navigation.navigate('CreateWisnuKuliner', { token }); // Navigasi ke halaman CreateWisnuKuliner dengan token
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
      { title: 'Tambah', icon: require('../../assets/events.png') },
      { title: 'Account', icon: require('../../assets/account.png') },
    ]}
  />
  );
};

export default TabBarKuliner;
