import React from 'react';
import { View, Text, Button } from 'react-native';

const WisataDashboard = ({ navigation }) => {
  return (
    <View>
      <Text>Selamat datang di Dashboard Wisata</Text>
      <Button title="Logout" onPress={() => navigation.replace('Login')} />
    </View>
  );
};

export default WisataDashboard;