import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../utils/api';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await login(email, password);
      if (response.status === 'success') {
        const { role } = response.data;

        // Simpan token ke AsyncStorage
        await AsyncStorage.setItem('userToken', response.data.token);

        // Arahkan berdasarkan role
        switch (role) {
          case 'admin':
            navigation.replace('AdminDashboard');
            break;
          case 'wisata':
            navigation.replace('WisataDashboard');
            break;
          case 'kuliner':
            navigation.replace('KulinerDashboard');
            break;
          case 'akomodasi':
            navigation.replace('AkomodasiDashboard');
            break;
          default:
            setError('Role tidak dikenali.');
        }
      } else {
        setError(response.message || 'Login gagal.');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat login.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
});

export default LoginScreen;