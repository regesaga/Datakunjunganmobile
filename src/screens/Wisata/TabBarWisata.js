import React, { useState } from 'react';
import { Alert, Dimensions, StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TabBarWisata = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState(0); // Default to the first tab
  const screenWidth = Dimensions.get('window').width;

  const handleTabPress = async (tabIndex) => {
    const token = await AsyncStorage.getItem('userToken'); // Fetch the token

    if (tabIndex === 1) { // Index for "Kunjungan" tab
      if (token) {
        navigation.navigate('KunjunganWisata', { token }); // Navigate to KunjunganWisata with token
      } else {
        Alert.alert('Error', 'Token tidak ditemukan!');
      }
    } else if (tabIndex === 2) { // Index for "Tambah" tab
      if (token) {
        navigation.navigate('CreateWisnuWisata', { token }); // Navigate to CreateWisnuWisata with token
      } else {
        Alert.alert('Error', 'Token tidak ditemukan!');
      }
    } else {
      console.log('Selected tab:', tabIndex);
    }

    setSelectedTab(tabIndex); // Update the selected tab state
  };

  return (
    <View style={[styles.tabBar, { width: screenWidth }]}>
      <TouchableOpacity
        style={[styles.tab, selectedTab === 0 && styles.activeTab]}
        onPress={() => handleTabPress(0)}
      >
        <Image
          source={require('../../assets/news.png')} // Dashboard icon
          style={[styles.icon, selectedTab === 0 && styles.activeIcon]}
        />
        <Text style={[styles.tabText, selectedTab === 0 && styles.activeTabText]}>Dashboard</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, selectedTab === 1 && styles.activeTab]}
        onPress={() => handleTabPress(1)}
      >
        <Image
          source={require('../../assets/events.png')} // Kunjungan icon
          style={[styles.icon, selectedTab === 1 && styles.activeIcon]}
        />
        <Text style={[styles.tabText, selectedTab === 1 && styles.activeTabText]}>Kunjungan</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, selectedTab === 2 && styles.activeTab]}
        onPress={() => handleTabPress(2)}
      >
        <Image
          source={require('../../assets/account.png')} // Tambah icon
          style={[styles.icon, selectedTab === 2 && styles.activeIcon]}
        />
        <Text style={[styles.tabText, selectedTab === 2 && styles.activeTabText]}>Tambah</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(40, 90, 90, 0.9)',
    zIndex: 10,
    paddingVertical: 10,
  },
  tab: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    flex: 1, // Ensure the tab takes full width based on content
  },
  icon: {
    width: 24,
    height: 24,
  },
  activeIcon: {
    tintColor: '#fff', // Change icon color when active
  },
  tabText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 5, // Add spacing between icon and text
  },
  activeTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Light background for active tab
    borderRadius: 10, // Rounded corners for active tab
    paddingVertical: 5, // Add padding for a cleaner look
    paddingHorizontal: 10, // Add horizontal padding to match the width of the content
  },
  activeTabText: {
    fontWeight: 'bold',
  },
});

export default TabBarWisata;
