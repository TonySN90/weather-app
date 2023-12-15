"use strict";

import "./../scss/main.scss";

const searchBtn = document.querySelector(".current-location__button");

const state = {
  location: "",
};

// API ---------------------

const URL = {
  currentWeather(lat, lon) {
    return `https://api.openweathermap.org/data/2.5/weather?${lat}&${lon}&units=metric`;
  },
  forecast(lat, lon) {
    return `https://api.openweathermap.org/data/2.5/forecast?${lat}&${lon}&units=metric`;
  },
  airPollution(lat, lon) {
    return `http://api.openweathermap.org/data/2.5/air_pollution?${lat}&${lon}`;
  },
  reverseGeocoding(lat, lon) {
    return `http://api.openweathermap.org/geo/1.0/reverse?${lat}&${lon}&limit=5`;
  },
  geocoding(query) {
    return `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5`;
  },
};
const API_KEY = "3f7d15f8a87ecf63772b7fcd776a2c91";
const defaultLocation = `#/weather?lat=53.62937&lon=11.41316`;

async function fetchData(url, query) {
  try {
    const response = await fetch(`${url}&appid=${API_KEY}`);
    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
  }
}

// const weekdayNames = [
//   "Sonntag",
//   "Montag",
//   "Dienstag",
//   "Mittwoch",
//   "Donnerstag",
//   "Freitag",
//   "Samstag",
// ];

// const monthNames = [
//   "Jan",
//   "Feb",
//   "Mär",
//   "Apr",
//   "Mai",
//   "Jun",
//   "Jul",
//   "Aug",
//   "Sep",
//   "Okt",
//   "Nov",
//   "Dez",
// ];

// function getDate(dateUnix, timezone) {
//   const date = new Date((dateUnix + timezone) * 1000);
//   const weekdayName = weekdayNames[date.getUTCDay()];
//   const monthName = monthNames[date.getUTCMonth()];
//   return `${weekdayName} ${date.getUTCDate()}, ${monthName}`;
// }

// function getTime(timeUnix, timezone) {
//   const date = new Date((timeUnix + timezone) * 1000);
//   const hours = date.getUTCHours();
//   const minutes = date.getUTCMinutes();
//   const period = hours >= 12 ? "PM" : "AM";

//   return `${hours % 12 || 12}: ${minutes} ${period}`;
// }

// function mpsToKmh(mps) {
//   const mph = mps * 1000;
//   return mph / 1000;
// }

searchBtn.addEventListener("click", async () => {
  const inputFieldEl = document.querySelector(".search-view--input");
  state.location = inputFieldEl.value;

  console.log(state.location);
  // await fetchData(URL.geocoding(state.location));

  inputFieldEl.value = "";
});
