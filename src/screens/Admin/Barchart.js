import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet, useWindowDimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Barchart = ({ title, fillShadowGradient, year }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fetchedData, setData] = useState([]);

  const { width: screenWidth } = useWindowDimensions(); // This gives you the screen width dynamically
  const chartWidth = screenWidth - 40; // Adding padding (20 on each side) for chart
  const chartHeight = 220;

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#fff',
    backgroundGradientToOpacity: 0.5,
    fillShadowGradient,
    fillShadowGradientOpacity: 1,
    color: (opacity = 1) => `#023047`,
    labelColor: (opacity = 1) => `#333`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          throw new Error('Token tidak ditemukan');
        }

        // Build the endpoint URL conditionally based on the 'year' prop
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
  }, [year]); // Re-fetch data when 'year' prop changes

  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const chartData = {
    labels,
    datasets: [
      {
        data: fetchedData || [], // Fallback to an empty array if data is not available
      },
    ],
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>{title}</Text>
      </View>
      {loading ? (
        <Text>Memuat data...</Text>
      ) : error ? (
        <Text>{error}</Text>
      ) : chartData.datasets[0].data.length > 0 ? (
        <BarChart
          data={chartData}
          width={chartWidth}
          height={chartHeight}
          chartConfig={chartConfig}
          showBarTops={false}
          style={styles.chartStyle}
        />
      ) : (
        <Text>Data tidak tersedia.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  titleText: {
    fontSize: 18, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 10,
  },
  chartStyle: {
    marginVertical: 10,
    borderRadius: 16,
  },
});

export default Barchart;
