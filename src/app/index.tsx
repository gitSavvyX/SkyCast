import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getWeather, searchCity } from '../api';
import { WeatherData } from '../types';

export default function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [cityName, setCityName] = useState('Karachi');

  useEffect(() => {
    const fetchTestWeather = async () => {
      setLoading(true);
      // 1. Get coordinates for the city
      const location = await searchCity(cityName);
      if (location) {
        // 2. Get weather for those coordinates
        const data = await getWeather(location.latitude, location.longitude);
        setWeather(data);
      }
      setLoading(false);
    };
    fetchTestWeather();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Weather...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>SkyCast Shell</Text>
      {weather ? (
        <View style={styles.card}>
          <Text style={styles.city}>{cityName}</Text>
          <Text style={styles.temp}>{weather.current_weather.temperature}°C</Text>
          <Text>Wind: {weather.current_weather.windspeed} km/h</Text>
          
          <Text style={styles.subtitle}>5-Day Forecast</Text>
          {weather.daily.time.map((date, index) => (
            <View key={date} style={styles.forecastRow}>
              <Text>{date}</Text>
              <Text>{weather.daily.temperature_2m_min[index]}°C - {weather.daily.temperature_2m_max[index]}°C</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text>Failed to load weather.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f0f4f8', paddingTop: 60 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 12, elevation: 3 },
  city: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  temp: { fontSize: 48, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  forecastRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
});


