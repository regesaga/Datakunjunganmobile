import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, ActivityIndicator } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { URL } from '../../URL';

const Barchart = ({ title, year }) => {
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
          ? `${URL}/api/v1/kunjungan/dashboardadmin?year=${year}`
          : `${URL}/api/v1/kunjungan/dashboardadmin`;

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
    label: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index],
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
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#177AD5" />
          <Text style={styles.loadingText}>Memuat data...</Text>
        </View>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : chartData.length > 0 ? (
        <BarChart
        spacing={13} // Adjust spacing between bars
        barWidth={barWidth} // Dynamically adjusted bar width
        frontColor="#177AD5"
        backColor="#B0C4DE"
        data={chartData}
        hideRules
        yAxisThickness={0} // Menonaktifkan ketebalan garis sumbu Y
        xAxisThickness={0} // Menonaktifkan ketebalan garis sumbu X
        width={chartWidth} // Use screen width minus padding
        showLine={false} // Menonaktifkan garis di atas grafik
        showGrid={false} // Menonaktifkan grid (garis horizontal dan vertikal)
        showYAxisLabels={false}
        noOfSections={4} // Menonaktifkan label sumbu Y
        barBorderRadius={5} // Border radius for bars
        animated
        initialSpacing={20}
        showValuesAsTopLabel // Menampilkan angka di atas setiap bar
        topLabelTextStyle={{
          color: '#333', // Warna teks angka
          fontSize: 12, // Ukuran font angka
          fontWeight: 'bold', // Membuat teks bold
        }}
      />
      
      ) : (
        <Text style={styles.noDataText}>Data tidak tersedia.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15, // Ensures some padding from the sides
    backgroundColor: '#fff',
    borderRadius: 15, // Optional: rounded corners
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
    paddingBottom: 20, // Padding at the bottom of the card
    paddingTop: 15,
    paddingHorizontal: 15,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
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

export default Barchart;
