import React, { useState } from 'react';
import { Alert, Dimensions, StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TabBarAdmin = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState(0); // Default to the first tab
  const screenWidth = Dimensions.get('window').width;

  const handleTabPress = async (tabIndex) => {
    const token = await AsyncStorage.getItem('userToken'); // Fetch the token

    if (tabIndex === 2) { // Index for "Kunjungan" tab
      if (token) {
        navigation.navigate('KunjunganAdmin', { token }); // Navigate to KunjunganAdmin with token
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
        style={[styles.tab, selectedTab === 2 && styles.activeTab]}
        onPress={() => handleTabPress(2)}
      >
        <Image
          source={require('../../assets/events.png')} // Kunjungan icon
          style={[styles.icon, selectedTab === 2 && styles.activeIcon]}
        />
        <Text style={[styles.tabText, selectedTab === 2 && styles.activeTabText]}>Kunjungan</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(40, 90, 90, 0.9)',
    zIndex: 10,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
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
    marginTop: 5,
  },
  activeTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Light background for active tab
    borderRadius: 10, // Rounded corners for active tab
    padding: 5, // Add padding for a cleaner look
  },
  activeTabText: {
    fontWeight: 'bold',
  },
});

export default TabBarAdmin;
