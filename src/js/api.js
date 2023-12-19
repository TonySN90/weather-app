import { API_KEY } from "./config";

export const URL = {
  currentWeather(lat, lon) {
    return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=de&units=metric`;
  },
  forecast(lat, lon) {
    return `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&lang=de&units=metric`;
  },
  airPollution(lat, lon) {
    return `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}`;
  },
  reverseGeocoding(lat, lon) {
    return `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5`;
  },
  geocoding(query) {
    return `https://api.openweathermap.org/geo/1.0/direct?q=${query}&lang=de&limit=5`;
  },
};

export async function fetchData(url) {
  try {
    const response = await fetch(`${url}&appid=${API_KEY}`);
    if (!response.ok) {
      throw new Error(
        `Network response was not ok, status: ${response.status}`
      );
    }

    const result = await response.json();

    if (result.length === 0) throw new Error("Ungültiger Eintrag!");
    return result;
  } catch (error) {
    throw error;
  }
}
