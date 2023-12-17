import { API_KEY } from "./config";

export const URL = {
    currentWeather(lat, lon) {
      return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric`;
    },
    forecast(lat, lon) {
      return `https://api.openweathermap.org/data/2.5/forecast?${lat}&${lon}&units=metric`;
    },
    airPollution(lat, lon) {
      return `http://api.openweathermap.org/data/2.5/air_pollution?${lat}&${lon}`;
    },
    reverseGeocoding(lat, lon) {
      return `https://api.openweathermap.org/geo/1.0/reverse?${lat}&${lon}&limit=5`;
    },
    geocoding(query) {
      return `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5`;
    },
  };


  export async function fetchData(url) {
    try {
      const response = await fetch(`${url}&appid=${API_KEY}`);
      if(!response.ok) return;

      const result = await response.json();

      if (result.length === 0) return false;
      else return result;

    } catch (error) {
      console.error(`Error: ${error}`);
    }
  }