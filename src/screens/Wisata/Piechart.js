// PieChart.js
import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { URL } from '../../URL';

const Piechart = ({ year }) => {
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

        const endpoint = year
          ? `${URL}/api/v1/kunjungan/dashboardwisata?year=${year}`
          : `${URL}/api/v1/kunjungan/dashboardwisata`;

        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const kelompokData = response.data.data.kelompokData; // Pastikan API mengembalikan struktur ini

        const chartData = kelompokData.map((item) => ({
          name: item.name,
          population: item.value,
          color: getRandomColor(),
          legendFontColor: '#7F7F7F',
          legendFontSize: 12,
        }));

        setData(chartData);
      } catch (err) {
        setError('Gagal memuat data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year]); // Re-fetch data jika year berubah

  // Fungsi untuk menghasilkan warna acak
  const getRandomColor = () =>
    `#${Math.floor(Math.random() * 16777215).toString(16)}`;

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.titleText}>
        Kunjungan Nusantara Tahun {year}
      </Text>
      {loading ? (
        <Text>Memuat data...</Text>
      ) : error ? (
        <Text>{error}</Text>
      ) : data.length > 0 ? (
        <PieChart
          data={data}
          width={Dimensions.get('window').width - 20}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          padding="15"
          absolute // Menampilkan nilai absolut di grafik
        />
      ) : (
        <Text>Data tidak tersedia.</Text>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 10, // Horizontal margin to provide space from edges
    marginBottom: 12, // Space below the card
    backgroundColor: '#fff',
    borderRadius: 10, // Rounded corners
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    paddingBottom: 20, 
    
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15, // Spacing below the title
  },
});
export default Piechart;
