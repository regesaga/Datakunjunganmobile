import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Button } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminDashboard = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          throw new Error('Token tidak ditemukan');
        }

        const response = await axios.get(
          'http://192.168.100.206:8000/api/v1/kunjungan/dashboardadmin',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Mengambil data totalKunjungan dari response
        setData(response.data.data.totalKunjungan || []);
      } catch (err) {
        setError('Gagal memuat data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Grafik Total Kunjungan</Text>
      {loading ? (
        <Text>Memuat data...</Text>
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : data.length > 0 ? (
        <LineChart
          data={{
            labels: labels,
            datasets: [
              {
                data: data,
              },
            ],
          }}
          width={Dimensions.get('window').width - 20}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#f3f3f3',
            backgroundGradientTo: '#e3e3e3',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
          bezier
          style={{
            marginVertical: 10,
            borderRadius: 16,
          }}
        />
      ) : (
        <Text>Data tidak tersedia.</Text>
      )}
      <View style={styles.logoutContainer}>

        <Button title="Logout" color="#FF3B30" onPress={() => navigation.replace('Login')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
  logoutContainer: {
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 20,
  },
});

export default AdminDashboard;
