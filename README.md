# SkyCast ☁️
*A clean, offline-first weather application built with React Native.*

## 📖 About the Project
SkyCast is a mobile weather application designed to provide readable, fast weather forecasts even when connectivity is slow. It uses the Open-Meteo API to fetch live geocoding and weather data. 

This project was developed during Week 3 of the **Stack & Scale Mobile App Development Internship**.

## ✨ Features
- **City Search:** Search for any city globally using the Open-Meteo Geocoding API.
- **Current Weather & Forecast:** Displays live temperature, wind speed, and a 7-day forecast.
- **Favorites:** Save locations to easily switch between them (persists via AsyncStorage).
- **Offline Caching:** Caches the last successful forecast. If the network fails, it shows the cached data with a clear "Offline" warning badge.
- **Error Handling:** Gracefully handles invalid city names and network timeouts.

## 🛠️ Tech Stack
- **Framework:** React Native (Expo)
- **Language:** TypeScript
- **API:** [Open-Meteo](https://open-meteo.com/) (Free, no API key required)
- **Storage:** AsyncStorage (Local Persistence)
- **UI:** Expo Linear Gradient, Expo Vector Icons

## 🚀 How to Run the Project Locally
1. Clone the repository:
   git clone https://github.com/gitSavvyX/SkyCast.git
2. Navigate into the folder and install dependencies:
   cd SkyCast
   npm install
3. Start the Expo development server:
   npx expo start
4. Press `w` to open in the web browser, or scan the QR code with the **Expo Go** app.

## ⚠️ Known Limitations
- No GPS-based location (uses manual search only).
- No temperature unit toggle (Celsius only).
- Offline cache only stores the most recent city searched.

## 🤖 Acknowledgements
- Weather data provided by Open-Meteo.
- Built as part of the Stack & Scale Remote Internship 2026.
