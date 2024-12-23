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
  const barWidth = Math.max(18, (chartWidth / fetchedData.length) * 0.8); // Lebar batang

  // Fetch data from API
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

        // Assume response.data.data.totalKunjungan is an array of numbers
        setFetchedData(response.data.data.totalKunjungan || []);
      } catch (err) {
        setError('Data Belum tersedia.');
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
  const spacing = (chartWidth - (barWidth * chartData.length)) / (chartData.length + 1);

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
        spacing={spacing} // Use dynamic spacing
        barWidth={barWidth} // Dynamically adjusted bar width
        frontColor="lightgray"
        data={chartData}
        hideRules 
        yAxisThickness={0} // Menonaktifkan ketebalan garis sumbu Y (untuk menghilangkan garis vertikal)
        xAxisThickness={0} // Menonaktifkan ketebalan garis sumbu X (untuk menghilangkan garis horizontal)
        width={chartWidth} // Use screen width minus padding
        showLine={false} // Menonaktifkan garis di atas grafik
        showGrid={false}  // Menonaktifkan grid (garis horizontal dan vertikal)
        showYAxisLabels={false}
        noOfSections={4}  // Menonaktifkan label sumbu Y
        barBorderRadius={5} // Border radius for 
        initialSpacing={spacing / 2} // Dynamic initial spacing
        showValuesAsTopLabel // Menampilkan angka di atas setiap bar
        topLabelTextStyle={{
          color: '#333', // Warna teks angka
          fontSize: 12, // Ukuran font angka
          fontWeight: 'bold', // Membuat teks bold
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
