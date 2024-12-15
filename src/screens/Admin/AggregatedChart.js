import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { URL } from '../../URL'; // Sesuaikan URL

const AggregatedChart = ({ year }) => {
  const [targetData, setTargetData] = useState([]);
  const [realisasiData, setRealisasiData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { width: screenWidth } = useWindowDimensions(); // Get screen width dynamically

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
          headers: { Authorization: `Bearer ${token}` },
        });

        const target = response.data?.data?.target || [];
        const realisasi = response.data?.data?.target || [];

        console.log('Target:', target); // Debugging
        console.log('Realisasi:', realisasi); // Debugging

        const targetLine = target && target.length > 0 ? target.map((item, index) => ({
          value: item.target || 0,
          label: getMonthLabel(index),
        })) : [];

        const realisasiLine = realisasi && realisasi.length > 0 ? realisasi.map((item, index) => ({
          value: item.realisasi || 0,
          label: getMonthLabel(index),
        })) : [];

        setTargetData(targetLine);
        setRealisasiData(realisasiLine);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [year]);

  const getMonthLabel = (index) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[index] || '';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#177AD5" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  console.log('Target Data:', targetData); // Debugging
  console.log('Realisasi Data:', realisasiData); // Debugging

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Agregat Target dan Realisasi Kunjungan</Text>
      </View>

      <LineChart
        data={targetData}
        data2={realisasiData}
        width={screenWidth - 40} // Responsif
        height={300}
        spacing={30}
        initialSpacing={10}
        textColor1="black"
        textColor2="black"
        color1="#177AD5" // Garis Target
        color2="red" // Garis Realisasi
        thickness={3}
        hideRules
        rulesColor="#ccc"
        noOfSections={4}
        yAxisColor="#000"
        xAxisColor="#000"
        yAxisThickness={0}
        xAxisThickness={0}
        yAxisTextStyle={{ color: '#555', fontSize: 12 }}
        xAxisLabelTextStyle={{ color: '#555', fontSize: 12 }}
        dataPointsColor1="blue"
        dataPointsColor2="red"
        showDataPoints
        dataPointsRadius={3} // Ukuran titik data lebih besar
        dataPointsWidth={2} // Garis titik lebih tebal
      />

      {/* Legenda */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#177AD5' }]} />
          <Text style={styles.legendText}>Target</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: 'red' }]} />
          <Text style={styles.legendText}>Realisasi</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
    paddingBottom: 20,
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
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  legendColor: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#555',
  },
});

export default AggregatedChart;
