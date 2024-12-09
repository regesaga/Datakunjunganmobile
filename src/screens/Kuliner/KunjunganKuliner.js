import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, StatusBar, SafeAreaView, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { URL } from '../../URL';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { Calendar } from 'react-native-calendars';


const KunjunganKuliner = ({ route }) => {
  const { token } = route.params;

  const [selectedDate, setSelectedDate] = useState('');
  const [msg, setMsg] = useState('');
  const [apiData, setApiData] = useState(null); // Menyimpan data API
  const [markedDates, setMarkedDates] = useState({});
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const navigation = useNavigation();

  const formatDateIndonesia = (dateString) => {
    const parsedDate = parseISO(dateString);
    return format(parsedDate, "EEEE, dd MMMM yyyy", { locale: id });
  };

  const getDataKunjunganKuliner = async () => {
    setLoading(true);
    setRefresh(true);
    try {
      const response = await axios.get(`${URL}/api/v1/kunjungankuliner/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`, // Sertakan token untuk autentikasi
        },
      });

      const { success, messages, data } = response.data;
      if (success) {
        setMsg(messages);
        setApiData(data);

        const marked = {};
        data.forEach((event) => {
          const eventDate = format(parseISO(event.tanggal_kunjungan), 'yyyy-MM-dd'); // Format date to yyyy-MM-dd
          marked[eventDate] = {
            marked: true,
            dotColor: '#F75D37',
            color: '#3a696c',
            textColor: 'white',
          };
        });
        setMarkedDates(marked);
      } else {
        console.error('Error: ', messages);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefresh(false);
    }
  };

  useEffect(() => {
    getDataKunjunganKuliner();
  }, [token]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const renderEventDetails = ({ item }) => (
    <View style={styles.cardContainer} key={item.kuliner_id}>
      <View style={styles.cardHeader}>
        <Text style={styles.dateText}>{formatDateIndonesia(item.tanggal_kunjungan)}</Text>
        <Text style={styles.namakuliner}>Jumlah Kunjungan {item.total_kunjungan}</Text>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.section}>
          <Text style={styles.subTitle}>Nusantara:</Text>
          {item.kelompok_kunjungan.map((kelompok) => (
            <Text key={kelompok.kelompok_kunjungan_id} style={styles.detailsText}>
              <Text style={styles.groupName}>{kelompok.nama_kelompok}</Text>{' '}
              Laki-laki: {kelompok.jumlah_laki_laki}, Perempuan: {kelompok.jumlah_perempuan}
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.subTitle}>Mancanegara:</Text>
          {item.wisman_by_negara.map((wisman) => (
            <Text key={wisman.wismannegara_id} style={styles.detailsText}>
              <Text style={styles.countryName}>{wisman.nama_negara}</Text> 
              Laki-laki: {wisman.jml_wisman_laki}, Perempuan: {wisman.jml_wisman_perempuan}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );

  const filteredEvents = selectedDate
    ? apiData.filter(event => format(parseISO(event.tanggal_kunjungan), 'yyyy-MM-dd') === selectedDate)
    : apiData;

  return loading ? (
    <ActivityIndicator size="large" color="#ed6f34" />
  ) : (
    <>
      <StatusBar hidden />
      <View style={styles.frameChildPosition}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          {/* Add back button icon here if needed */}
        </TouchableOpacity>
      </View>

      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          ...markedDates,
          [selectedDate]: { selected: true, marked: true, selectedColor: '#3a696c' },
        }}
        theme={{
          selectedDayBackgroundColor: '#ed6f34',
          todayTextColor: '#ed6f34',
          arrowColor: '#ed6f34',
          textSectionTitleColor: 'black',
          textDisabledColor: 'gray',
          textDayFontWeight: 'bold',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: 'bold',
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 16,
        }}
      />

      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.kuliner_id.toString()}
        renderItem={renderEventDetails}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Tidak ada acara untuk tanggal yang dipilih.</Text>
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={() => {
              setRefresh(true);
              getDataKunjunganKuliner();
              setRefresh(false);
            }}
          />
        }
        contentContainerStyle={styles.container}
      />

      <SafeAreaView />
    </>
  );
};

const styles = StyleSheet.create({
  // Card container style
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cardHeader: {
    marginBottom: 10,
  },
  dateText: {
    color: '#777',
    fontSize: 16,
    fontWeight: 'bold',
  },
  namakuliner: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3a696c',
    marginTop: 5,
  },
  cardBody: {
    marginTop: 10,
  },
  section: {
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3a696c',
    marginBottom: 5,
  },
  detailsText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  groupName: {
    fontWeight: 'bold',
    color: '#ed6f34',
  },
  countryName: {
    fontWeight: 'bold',
    color: '#3a696c',
  },
  frameChildPosition: {
    // Your custom back button styling (optional)
  },
  backButton: {
    // Your custom back button styling (optional)
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
  },
  container: {
    paddingBottom: 20,
  },
});

export default KunjunganKuliner;
