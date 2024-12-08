import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-gifted-charts'; // Import both LineChart and BarChart
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient, Stop } from 'react-native-svg';

const Linechart = ({ year }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { width: screenWidth } = useWindowDimensions(); // Get screen width dynamically

  const chartWidth = screenWidth - 40; // 40px padding for both sides
  const barSpacing = Math.max(4, chartWidth / (data.length * 1.5)); // Adjust spacing dynamically
  const barWidth = Math.max(10, chartWidth / (data.length * 2)); // Adjust bar width dynamically

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

        setData(response.data.data.totalKunjungan || []);
      } catch (err) {
        setError('Gagal memuat data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year]);

  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const lineData = data.map((value, index) => ({
    value,
    label: labels[index],
  }));

  const barData = data.map((value, index) => ({
    value,
    label: labels[index],
    frontColor: '#4BC8FF', // Customize this for bar color
    backColor: '#C6F3FF', // Lighter color for bars
    borderColor: '#8B8B8B',
    borderWidth: 5,
  }));

  return (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Grafik Kunjungan per Bulan Tahun {year}</Text>
        {loading ? (
          <Text>Memuat data...</Text>
        ) : error ? (
          <Text>{error}</Text>
        ) : lineData.length > 0 ? (
          <View style={styles.chartContainer}>
            {/* Bar Chart */}
            <BarChart
            showLine
            
              data={barData}
              width={chartWidth}
              style={styles.chart}
              spacing={barSpacing}
              barWidth={barWidth}
              yAxisThickness={0}
              xAxisThickness={0}
              xAxisLabelTextStyle={{
                fontSize: 12,
                color: '#000',
              }}
              xAxisLabelTextAlign="center"
            />
            {/* Line Chart on top of Bar Chart */}
            <LineChart
              data={lineData}
              lineGradient
              lineGradientId="ggrd"
              smoothing={0.3}  // Apply smoothing for a clean curve
              yAxisThickness={0}
              xAxisThickness={0}
              lineGradientComponent={() => {
                return (
                  <LinearGradient id="ggrd" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor="orange" />
                    <Stop offset="1" stopColor="red" />
                  </LinearGradient>
                );
              }}
              width={chartWidth}
              style={styles.chart}
              xAxisLabelTextStyle={{
                fontSize: 12,
                color: '#000',
              }}
              xAxisLabelTextAlign="center"
            />
          </View>
        ) : (
          <Text>Data tidak tersedia.</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
    marginHorizontal: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  chartContainer: {
    position: 'relative',
  },
  chart: {
    borderRadius: 16,
  },
});

export default Linechart;
