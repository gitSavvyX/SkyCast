import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { ActivityIndicator, Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getWeather, searchCity } from '../api';
import { WeatherData } from '../types';

export default function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [cityName, setCityName] = useState('');
  const [displayCity, setDisplayCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = async () => {
    if (!cityName.trim()) return;
    
    Keyboard.dismiss();
    setLoading(true);
    setErrorMsg('');
    setWeather(null);

    // 1. Get coordinates
    const location = await searchCity(cityName);
    
    if (location) {
      // 2. Get weather
      const data = await getWeather(location.latitude, location.longitude);
      if (data) {
        setWeather(data);
        setDisplayCity(`${location.name}, ${location.country}`);
      } else {
        setErrorMsg('Failed to fetch weather data.');
      }
    } else {
      setErrorMsg('City not found. Please check spelling.');
    }
    
    setLoading(false);
  };

  // Helper to format dates nicely (e.g., "Tue, Nov 10")
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <LinearGradient colors={['#4F46E5', '#7C3AED', '#1E1B4B']} style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a city..."
          placeholderTextColor="#A5B4FC"
          value={cityName}
          onChangeText={setCityName}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Ionicons name="search" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FFF" />
          <Text style={styles.loadingText}>Fetching weather...</Text>
        </View>
      )}

      {errorMsg ? (
        <View style={styles.center}>
          <Ionicons name="cloud-offline" size={60} color="#FCA5A5" />
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : null}

      {weather && !loading ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.currentCard}>
            <Text style={styles.cityText}>{displayCity}</Text>
            <Text style={styles.tempText}>{weather.current_weather.temperature}°C</Text>
            <Text style={styles.windText}>Wind: {weather.current_weather.windspeed} km/h</Text>
          </View>

          <View style={styles.forecastContainer}>
            <Text style={styles.forecastTitle}>5-Day Forecast</Text>
            {weather.daily.time.map((date, index) => (
              <View key={date} style={styles.forecastRow}>
                <Text style={styles.dateText}>{formatDate(date)}</Text>
                <View style={styles.tempRange}>
                  <Text style={styles.minTemp}>{Math.round(weather.daily.temperature_2m_min[index])}°</Text>
                  <View style={styles.tempBar} />
                  <Text style={styles.maxTemp}>{Math.round(weather.daily.temperature_2m_max[index])}°</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      ) : null}

      {!weather && !loading && !errorMsg ? (
        <View style={styles.center}>
          <Ionicons name="partly-sunny" size={80} color="#A5B4FC" />
          <Text style={styles.emptyText}>Search for a city to see the weather.</Text>
        </View>
      ) : null}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
  searchContainer: { flexDirection: 'row', marginBottom: 20 },
  searchInput: { flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', color: '#FFF', padding: 15, borderRadius: 12, fontSize: 16, marginRight: 10 },
  searchBtn: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 15, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  loadingText: { color: '#FFF', marginTop: 10, fontSize: 16 },
  errorText: { color: '#FCA5A5', marginTop: 15, fontSize: 18, textAlign: 'center', fontWeight: 'bold' },
  emptyText: { color: '#A5B4FC', marginTop: 15, fontSize: 16, textAlign: 'center' },
  scrollContent: { paddingBottom: 40 },
  currentCard: { alignItems: 'center', marginBottom: 30, marginTop: 10 },
  cityText: { color: '#FFF', fontSize: 24, fontWeight: '600', marginBottom: 5 },
  tempText: { color: '#FFF', fontSize: 72, fontWeight: '800' },
  windText: { color: '#E0E7FF', fontSize: 16 },
  forecastContainer: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: 20 },
  forecastTitle: { color: '#FFF', fontSize: 18, fontWeight: '700', marginBottom: 15 },
  forecastRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  dateText: { color: '#E0E7FF', fontSize: 15, width: 100 },
  tempRange: { flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'flex-end' },
  minTemp: { color: '#A5B4FC', fontSize: 16, width: 35, textAlign: 'center' },
  tempBar: { height: 4, backgroundColor: 'rgba(255,255,255,0.2)', flex: 1, marginHorizontal: 10, borderRadius: 2 },
  maxTemp: { color: '#FFF', fontSize: 16, width: 35, textAlign: 'center', fontWeight: 'bold' },
});