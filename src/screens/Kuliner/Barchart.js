import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { URL } from '../../URL';

const Barchart = ({ title, fillShadowGradient, year }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fetchedData, setFetchedData] = useState([]);

  const { width: screenWidth } = useWindowDimensions(); // Get screen width dynamically
  const chartWidth = screenWidth - 40; // Set chart width with padding

  // Calculate bar width dynamically based on screen width
  const barWidth = screenWidth < 350 ? 18 : 22; // Adjust bar width for smaller screens

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          throw new Error('Token tidak ditemukan');
        }

        const endpoint = year
          ? `${URL}/api/v1/kunjungan/dashboardkuliner?year=${year}`
          : `${URL}/api/v1/kunjungan/dashboardkuliner`;

        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Assume response.data.data.totalKunjungan is an array of numbers
        setFetchedData(response.data.data.totalKunjungan || []);
      } catch (err) {
        setError('Gagal memuat data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year]); // Re-fetch data when 'year' prop changes

  // Prepare data for BarChart (Gifted Chart format)
  const chartData = fetchedData.map((value, index) => ({
    value,
    label: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index],
    frontColor: '#177AD5', // Customize this as needed
    backColor: '#B0C4DE', // Lighter color for the back shadow (simulating depth)
    borderColor: '#8B8B8B', // Slight border to simulate depth
    borderWidth: 2, // Slight border for 3D effect
  }));

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Grafik Kunjungan per Bulan Tahun {year}</Text>
      </View>
      {loading ? (
        <Text>Memuat data...</Text>
      ) : error ? (
        <Text>{error}</Text>
      ) : chartData.length > 0 ? (
        <BarChart
  spacing={13} // Adjust spacing between bars
  barWidth={barWidth} // Dynamically adjusted bar width
  frontColor="#177AD5" // Warna bar
  backColor="#B0C4DE" // Warna bayangan belakang
  data={chartData}
  hideRules
  yAxisThickness={0} // Menonaktifkan garis sumbu Y
  xAxisThickness={0} // Menonaktifkan garis sumbu X
  width={chartWidth} // Lebar chart
  showLine={false} // Menonaktifkan garis di atas grafik
  showGrid={false} // Menonaktifkan grid
  showYAxisLabels={false}
  noOfSections={4} // Jumlah bagian pada sumbu Y
  barBorderRadius={10} // Border radius untuk bar
  showValuesAsTopLabel={true} // Menampilkan angka di atas bar
  topLabelTextStyle={{
    color: '#333', // Warna teks angka
    fontSize: 12, // Ukuran font angka
    fontWeight: 'bold', // Ketebalan teks angka
  }}
/>

      
      ) : (
        <Text>Data tidak tersedia.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10, // Ensures some padding from the sides
    backgroundColor: '#fff',
    borderRadius: 10, // Optional: rounded corners
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 12,
    paddingBottom: 20, // Padding at the bottom of the card
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 15,
  },
});

export default Barchart;
