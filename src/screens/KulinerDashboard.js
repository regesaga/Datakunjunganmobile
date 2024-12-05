import React from 'react';
import { View, Text, Button } from 'react-native';

const KulinerDashboard = ({ navigation }) => {
  return (
    <View>
      <Text>Selamat datang di Dashboard Kuliner</Text>
      <Button title="Logout" onPress={() => navigation.replace('Login')} />
    </View>
  );
};

export default KulinerDashboard;