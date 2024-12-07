// PieChart.js
import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
          ? `http://192.168.100.206:8000/api/v1/kunjungan/dashboardadmin?year=${year}`
          : `http://192.168.100.206:8000/api/v1/kunjungan/dashboardadmin`;

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
    <View>
      <Text style={{ textAlign: 'center', fontSize: 16, marginBottom: 10 }}>
        Grafik Total Kunjungan Tahun {year}
      </Text>
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
          width={Dimensions.get('window').width - 20}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute // Menampilkan nilai absolut di grafik
        />
      ) : (
        <Text>Data tidak tersedia.</Text>
      )}
    </View>
  );
};

export default Piechart;
