import React from 'react';
import { View, Text, Button } from 'react-native';

const AkomodasiDashboard = ({ navigation }) => {
  return (
    <View>
      <Text>Selamat datang di Dashboard Akomodasi</Text>
      <Button title="Logout" onPress={() => navigation.replace('Login')} />
    </View>
  );
};

export default AkomodasiDashboard;