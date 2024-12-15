import React, { useState } from 'react';
import { Alert, Dimensions, StyleSheet } from 'react-native';
import TabBar from 'fluidbottomnavigation-rn';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TabBarAdmin = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState(null);
  const screenWidth = Dimensions.get('window').width;

  const handleTabPress = async (tabIndex) => {
    const token = await AsyncStorage.getItem('userToken'); // Make sure to fetch the token here

    if (tabIndex === 1) { // Indeks tab "Kunjungan"
      if (token) {
        navigation.navigate('KunjunganAdmin', { token }); // Navigasi ke halaman KunjunganAdmin dengan token
      } else {
        Alert.alert('Error', 'Token tidak ditemukan!');
      }
    } else if (tabIndex === 4) { // Indeks tab "Tambah"
      if (token) {
        navigation.navigate('CreateWisnuAdmin', { token }); // Navigasi ke halaman CreateWisnuAdmin dengan token
      } else {
        Alert.alert('Error', 'Token tidak ditemukan!');
      }
    } else {
      console.log('Selected tab:', tabIndex);
    }

    setSelectedTab(tabIndex); // Update the selected tab state
  };

  return (
    <TabBar
      tabBarStyle={[styles.tabBar, { width: screenWidth }]}
      onPress={handleTabPress}
      selectedIndex={selectedTab}
      values={[
        { title: 'Dashboard', icon: require('../../assets/news.png') },
        { title: 'List', icon: require('../../assets/requests.png') },
        { title: 'Kunjungan', icon: require('../../assets/events.png') },
        { title: 'Members', icon: require('../../assets/members.png') },
        { title: 'Tambah', icon: require('../../assets/account.png') },
      ]}
      activeTabStyle={styles.activeTab}
      inactiveTabStyle={styles.inactiveTab}
      iconSize={24}
    />
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'rgba(40, 90, 90, 0.9)',
    zIndex: 10, // Ensure the element is not covered
    paddingBottom: 10, // Add some padding to the bottom for better spacing
  },
  activeTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Light background for active tab
    borderRadius: 10, // Rounded corners for active tab
    padding: 5, // Add padding for a cleaner look
  },
  inactiveTab: {
    backgroundColor: 'transparent', // Transparent background for inactive tabs
  },
});

export default TabBarAdmin;
