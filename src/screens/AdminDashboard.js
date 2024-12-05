import React from 'react';
import { View, Text, Button } from 'react-native';

const AdminDashboard = ({ navigation }) => {
  return (
    <View>
      <Text>Selamat datang di Dashboard Admin</Text>
      <Button title="Logout" onPress={() => navigation.replace('Login')} />
    </View>
  );
};

export default AdminDashboard;