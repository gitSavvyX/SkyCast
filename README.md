# SkyCast ☁️
*A clean, offline-first weather application built with React Native.*

## 📖 About the Project
SkyCast is a mobile weather application designed to provide readable, fast weather forecasts even when connectivity is slow. It uses the Open-Meteo API to fetch live geocoding and weather data. 

This project is being developed during Week 3 of the **Stack & Scale Mobile App Development Internship**.

## ✨ Features
- **City Search:** Search for any city globally using the Open-Meteo Geocoding API.
- **Current Weather:** Displays live temperature and wind speed for the searched city.
- **7-Day Forecast:** Shows daily minimum and maximum temperatures.
- **Favorites (Coming Soon):** Save locations to easily switch between them.
- **Offline Caching (Coming Soon):** Cache the last successful forecast using AsyncStorage to view when offline.

## 🛠️ Tech Stack
- **Framework:** React Native (Expo)
- **Language:** TypeScript
- **API:** Open-Meteo (Free, no API key required)
- **Data Models:** Strict TypeScript interfaces mapping the API JSON response.

## 🚀 How to Run the Project Locally
1. Clone the repository:
   `git clone https://github.com/gitSavvyX/SkyCast.git`
2. Navigate into the folder and install dependencies:
   `cd SkyCast`
   `npm install`
3. Start the Expo development server:
   `npx expo start`
4. Press **`w`** to open the web version, or scan the QR code with **Expo Go** on your phone.

## ⚠️ Known Limitations
- The app currently uses a hardcoded test city (Karachi) on launch. The search bar UI will be wired up in the next update.
- Offline caching is not yet implemented.

## 🤖 Acknowledgements
- Weather data provided by [Open-Meteo](https://open-meteo.com/).
- Built as part of the Stack & Scale Remote Internship 2026.
