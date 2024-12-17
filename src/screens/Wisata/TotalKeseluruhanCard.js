import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Dimensions } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { URL } from '../../URL';

const TotalKeseluruhanCard = ({ year }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const InfoCard = ({ color, title, value, subtitle }) => {
    return (
      <View style={styles.card}>
        <View style={[styles.sideBar, { backgroundColor: color }]} />
        <View style={styles.cardContent}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.value}>{value}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          Alert.alert('Error', 'Token tidak ditemukan!');
          return;
        }

        const endpoint = year
          ? `${URL}/api/v1/kunjungan/dashboardwisata?year=${year}`
          : `${URL}/api/v1/kunjungan/dashboardwisata`;

        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.data) {
          setData(response.data.data.totalKeseluruhan || null);
        } else {
          setData(null);
          setError('Data tidak ditemukan');
        }
      } catch (err) {
        setError('Data Belum tersedia.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year]);

  if (loading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.card}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.card}>
        <Text style={styles.errorText}>Tidak ada data untuk ditampilkan.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <InfoCard
        color="rgba(251,200,83,255)"
        title="Nusantara"
        value={data.total_laki_laki + data.total_perempuan || 0}
      />
      <InfoCard
        color="#F44336"
        title="Mancanegara"
        value={data.total_wisman_laki + data.total_wisman_perempuan || 0}
      />
      <InfoCard
        color="#03A9F4"
        title="Total Pengunjung"
        value={
          data.total_laki_laki +
          data.total_perempuan +
          data.total_wisman_laki +
          data.total_wisman_perempuan || 0
        }
      />
    </View>
  );
};

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: 8,
      width: '31%', // Membuat setiap card memiliki lebar 31% untuk 3 card dalam satu baris
      elevation: 3,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      marginHorizontal: 3,
      marginBottom:12,
      borderWidth: 1,
      borderColor: '#ddd',
    },
    sideBar: {
      width: 8,
      height: '100%',
      borderTopLeftRadius: 8,
      borderBottomLeftRadius: 8,
    },
    cardContent: {
      flex: 1,
      padding: 10,
    },
    title: {
      fontSize: 10, // Ukuran font judul dapat disesuaikan dengan ukuran layar
      fontWeight: 'bold',
      color: '#333',
    },
    value: {
      fontSize: 16, // Ukuran font nilai dapat disesuaikan dengan ukuran layar
      fontWeight: 'bold',
      color: '#000',
    },
    subtitle: {
      fontSize: 12, // Ukuran font untuk subtitle
      color: '#555',
    },
    errorText: {
      fontSize: 12,
      color: 'red',
      textAlign: 'center',
    },
  });

export default TotalKeseluruhanCard;
