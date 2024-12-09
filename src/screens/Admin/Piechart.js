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
          ? `${URL}/api/v1/kunjungan/dashboardadmin?year=${year}`
          : `${URL}/api/v1/kunjungan/dashboardadmin`;

        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const totalKeseluruhan = response.data.data.totalKeseluruhan;
        const chartData = [
          { name: 'Wisata', count: totalKeseluruhan.totalkunjunganWisata, color: '#FF6384', legendFontColor: '#7F7F7F', legendFontSize: 12 },
          { name: 'Kuliner', count: totalKeseluruhan.totalkunjunganKuliner, color: '#36A2EB', legendFontColor: '#7F7F7F', legendFontSize: 12 },
          { name: 'Akomodasi', count: totalKeseluruhan.totalkunjunganAkomodasi, color: '#FFCE56', legendFontColor: '#7F7F7F', legendFontSize: 12 },
          { name: 'Event', count: totalKeseluruhan.totalkunjunganEvent, color: '#4BC0C0', legendFontColor: '#7F7F7F', legendFontSize: 12 },
        ];
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

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.titleText}>Grafik Total Kunjungan Tahun {year}</Text>
      {loading ? (
        <Text>Memuat data...</Text>
      ) : error ? (
        <Text>{error}</Text>
      ) : data.length > 0 ? (
        <PieChart
          data={data.map((item) => ({
            name: item.name,
            population: item.count,
            color: item.color,
            legendFontColor: item.legendFontColor,
            legendFontSize: item.legendFontSize,
          }))}
          width={Dimensions.get('window').width - 40} // Width with padding (left and right)
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute // Display absolute values on the chart
        />
      ) : (
        <Text>Data tidak tersedia.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 20, // Horizontal margin to provide space from edges
    marginBottom: 20, // Space below the card
    backgroundColor: '#fff',
    borderRadius: 10, // Rounded corners
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    paddingVertical: 20, // Vertical padding
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15, // Spacing below the title
  },
});

export default Piechart;
