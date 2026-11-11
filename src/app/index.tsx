import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { searchCity, getWeather } from '../api';
import { WeatherData, GeocodingResult } from '../types';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@skycast_favorites';

export default function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [cityName, setCityName] = useState('');
  const [currentCity, setCurrentCity] = useState<GeocodingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Favorites State
  const [favorites, setFavorites] = useState<GeocodingResult[]>([]);

  // Load favorites on startup
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load favorites");
    }
  };

  const saveFavoritesToStorage = async (newFavs: GeocodingResult[]) => {
    setFavorites(newFavs);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavs));
  };

  const toggleFavorite = () => {
    if (!currentCity) return;
    
    const isFav = favorites.some(f => f.id === currentCity.id);
    let newFavs;
    
    if (isFav) {
      newFavs = favorites.filter(f => f.id !== currentCity.id);
    } else {
      newFavs = [...favorites, currentCity];
    }
    saveFavoritesToStorage(newFavs);
  };

  const fetchWeatherForCity = async (location: GeocodingResult) => {
    setLoading(true);
    setErrorMsg('');
    setWeather(null);
    
    const data = await getWeather(location.latitude, location.longitude);
    if (data) {
      setWeather(data);
      setCurrentCity(location);
    } else {
      setErrorMsg('Failed to fetch weather data.');
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!cityName.trim()) return;
    
    Keyboard.dismiss();
    setLoading(true);
    setErrorMsg('');
    setWeather(null);

    const location = await searchCity(cityName);
    
    if (location) {
      await fetchWeatherForCity(location);
      setCityName(''); // Clear search bar after success
    } else {
      setErrorMsg('City not found. Please check spelling.');
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const isCurrentCityFavorite = currentCity ? favorites.some(f => f.id === currentCity.id) : false;

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

      {/* Favorites Row */}
      {favorites.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.favoritesRow}>
          {favorites.map((fav) => (
            <TouchableOpacity key={fav.id} style={styles.favChip} onPress={() => fetchWeatherForCity(fav)}>
              <Text style={styles.favText}>{fav.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

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

      {weather && !loading && currentCity ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.currentCard}>
            <View style={styles.cityHeader}>
              <Text style={styles.cityText}>{currentCity.name}, {currentCity.country}</Text>
              <TouchableOpacity onPress={toggleFavorite} style={{ marginLeft: 10 }}>
                <Ionicons name={isCurrentCityFavorite ? "star" : "star-outline"} size={28} color="#FBBF24" />
              </TouchableOpacity>
            </View>
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
  searchContainer: { flexDirection: 'row', marginBottom: 15 },
  searchInput: { flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', color: '#FFF', padding: 15, borderRadius: 12, fontSize: 16, marginRight: 10 },
  searchBtn: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 15, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  favoritesRow: { maxHeight: 40, marginBottom: 20 },
  favChip: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  favText: { color: '#FFF', fontWeight: '600' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  loadingText: { color: '#FFF', marginTop: 10, fontSize: 16 },
  errorText: { color: '#FCA5A5', marginTop: 15, fontSize: 18, textAlign: 'center', fontWeight: 'bold' },
  emptyText: { color: '#A5B4FC', marginTop: 15, fontSize: 16, textAlign: 'center' },
  scrollContent: { paddingBottom: 40 },
  currentCard: { alignItems: 'center', marginBottom: 30, marginTop: 10 },
  cityHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  cityText: { color: '#FFF', fontSize: 24, fontWeight: '600' },
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