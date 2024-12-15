import React, { useState, useLayoutEffect } from 'react';
import { View, TextInput, TouchableOpacity, StatusBar, Button, Text, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../utils/api'; // Sesuaikan path ini dengan file API Anda
import eyeoutline from '../assets/eyeoutline.png';
import eyeoffoutline from '../assets/eyeoffoutline.png';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // This hides the header
    });
  }, [navigation]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleLogin = async () => {
    try {
      const response = await login(email, password); // Panggil API login
      if (response.status === 'success') {
        const { role, token } = response.data;

        // Simpan token ke AsyncStorage
        await AsyncStorage.setItem('userToken', token);

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
    <View style={styles.sign}>
      <StatusBar hidden />
      <Text style={styles.title}>Smart Visiting</Text>
      <Image
        style={styles.kuninganbeu1Icon}
        resizeMode="cover"
        source={require("../assets/kuninganbeu.png")}
      />
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Masukan Email"
          mode="outlined"
          value={email}
          onChangeText={setEmail}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, styles.passwordInput]}
            placeholder="Password"
            value={password}
            mode="outlined"
            secureTextEntry={!showPassword}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Image
              source={showPassword ? eyeoutline : eyeoffoutline}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title="Login" onPress={handleLogin} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sign: {
    flex: 1,
    width: "100%",
    height: 812,
    overflow: "hidden",
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold', // Huruf tebal
    fontStyle: 'italic', // Huruf miring
    color: '#FF7F50', // Warna oranye mirip seperti di gambar
    textAlign: 'center',
    marginTop: 70,
    marginBottom: 20,
    textTransform: 'uppercase', // Huruf kapital semua
  },
  kuninganbeu1Icon: {
    marginLeft: -73.5,
    top: 123,
    width: 150,
    height: 150,
    left: "50%",
    position: "absolute",
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }], // Adjust this value based on the height of the input
  },
  icon: {
    width: 24,
    height: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
  },
  passwordInput: {
    paddingRight: 40, // Add padding to make space for the icon
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
});

export default LoginScreen;
