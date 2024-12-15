import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet, ActivityIndicator } from 'react-native';
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
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6384" />
          <Text style={styles.loadingText}>Memuat data...</Text>
        </View>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
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
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            backgroundGradientFrom: '#FF6384',
            backgroundGradientTo: '#36A2EB',
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#fff',
            },
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute // Display absolute values on the chart
        />
      ) : (
        <Text style={styles.noDataText}>Data tidak tersedia.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 10, // Horizontal margin to provide space from edges (same as Barchart)
    marginBottom: 12, // Space below the card (same as Barchart)
    backgroundColor: '#fff',
    borderRadius: 10, // Rounded corners (same as Barchart)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    paddingVertical: 20, // Vertical padding (same as Barchart)
    paddingHorizontal: 15, // Horizontal padding inside the card (same as Barchart)
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15, // Spacing below the title (same as Barchart)
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  loadingText: {
    fontSize: 16,
    color: '#888',
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});

export default Piechart;
