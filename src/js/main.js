"use strict";

import "./../scss/main.scss";

const searchBtn = document.querySelector(".current-location__button");
const dropDownEl = document.querySelector(".drop-down-menu__container");
const dropDownList = document.querySelector(".drop-down__li");
const locationName = document.querySelector(".header__location-city");
const locationNTime = document.querySelector(".header__location-time");
const now_temperature = document.querySelector(".now-section__temperature");
const now_feelsLike = document.querySelector(".now-section__feelsLike");
const now_rain = document.querySelector(".now-section__rain-probability");
const now_humidity = document.querySelector(".humidity__value");
const now_wind = document.querySelector(".wind-informations__value");

const state = {
  query: "",
  currentLocation: "",
  locationsList: [],
};

const API_KEY = "3f7d15f8a87ecf63772b7fcd776a2c91";
// const defaultLocation = `#/weather?lat=53.62937&lon=11.41316`;

// API ---------------------

const URL = {
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
    return `http://api.openweathermap.org/geo/1.0/reverse?${lat}&${lon}&limit=5`;
  },
  geocoding(query) {
    return `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5`;
  },
};

async function fetchData(url) {
  try {
    const response = await fetch(`${url}&appid=${API_KEY}`);
    const result = await response.json();

    return result;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

function createHtmlList() {
  state.locationsList.forEach((location) => {
    const listEntry = `<li class="drop-down__list-entry" data-lat="${
      location.lat
    }" data-lon="${location.lon}">${location.name} ${location.country} ${
      location.state ? location.state : ""
    }</li>`;
    dropDownList.insertAdjacentHTML("afterbegin", listEntry);
  });
}

function showHtmlList() {
  dropDownEl.style.display = "block";
  dropDownEl.style.opacity = "1";
}
function closeHtmlList() {
  dropDownEl.style.display = "none";
  dropDownEl.style.opacity = "0";
}

function updateDOM() {
  console.log(state);

  // HEADER
  locationName.innerHTML = state.currentWeather.name;

  // NOW SECTION
  now_temperature.innerHTML = `${Math.round(state.currentWeather.main.temp)}°C`;
  now_feelsLike.innerHTML = `Gefühlt wie ${Math.round(
    state.currentWeather.main.feels_like
  )}°C`;
  // now_rain.innerHTML = `${}`;
  now_humidity.innerHTML = `${state.currentWeather.main.humidity}%`;
  now_wind.innerHTML = `${Math.round(
    state.currentWeather.wind.speed * 3.6
  )}kmh/h`;
}

// Eventlistener

searchBtn.addEventListener("click", async () => {
  const inputFieldValue = document.querySelector(".search-view--input");
  state.query = inputFieldValue.value;

  // GEOCODING
  state.locationsList = await fetchData(URL.geocoding(state.query));

  createHtmlList(location);
  showHtmlList();

  inputFieldValue.value = "";

  dropDownList.addEventListener("click", async (e) => {
    const el = e.target;
    if (!el) return;

    console.log(el);
    const lat = el.dataset.lat;
    const lon = el.dataset.lon;

    closeHtmlList();

    // CURRENT WEATHER
    state.currentWeather = await fetchData(URL.currentWeather(lat, lon));

    updateDOM();

    // state.forecast = await fetchData(URL.forecast(lat, lon));
    // state.airPollution = await fetchData(URL.airPollution(lat, lon));
  });
});

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
