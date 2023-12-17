"use strict";

import "./../scss/main.scss";
import { fetchData, URL } from "./api";
import { getDate } from "./utils";

const displayDropDownBtn = document.querySelector(".current-location__button");
const dropDownEl = document.querySelector(".drop-down");
const dropDownList = document.querySelector(".drop-down__li");
const dropDownSearchBtn = document.querySelector(".drop-down__search_button");
const closeDropDownBtn = document.querySelector(".drop-down__close-button");

const locationName = document.querySelector(".header__location-city");
const locationNTime = document.querySelector(".header__location-time");

const now_temperature = document.querySelector(".now-section__temperature");
const now_feelsLike = document.querySelector(".now-section__feelsLike");
const now_rain = document.querySelector(".now-section__rain-probability");
const now_humidity = document.querySelector(".humidity__value");
const now_wind = document.querySelector(".wind-informations__value");
const now_sky = document.querySelector(".sky-informations-image");
const now_description = document.querySelector(
  ".now-section__weather-description"
);

const sunriseEl = document.querySelector(".sunrise__time");
const sunsetEl = document.querySelector(".sunset__time");

const state = {
  query: "",
  currentLocation: "",
  locationsList: [],
};

function createHtmlListEntries() {
  state.locationsList.forEach((location) => {
    const listEntry = `<li class="drop-down__list-entry" data-lat="${
      location.lat
    }" data-lon="${location.lon}">${location.name} ${location.country} ${
      location.state ? location.state : ""
    }</li>`;
    dropDownList.insertAdjacentHTML("afterbegin", listEntry);
  });
}

function displayDropDownMEnu() {
  dropDownEl.style.top = "0";
}
function closeDropDownMenu() {
  dropDownEl.style.top = "-10rem";
}

function clearDropDownList() {
  dropDownList.innerHTML = "";
}

function updateDOM() {
  // HEADER
  locationName.innerHTML = state.currentWeather.name;
  locationNTime.innerHTML = getDate(
    state.currentWeather.dt,
    state.currentWeather.timezone
  );

  // NOW SECTION
  now_description.innerHTML = `Aktuell: ${state.currentWeather.weather[0].description}`;
  now_temperature.innerHTML = `${Math.round(state.currentWeather.main.temp)}°C`;
  now_feelsLike.innerHTML = `Gefühlt wie ${Math.round(
    state.currentWeather.main.feels_like
  )}°C`;
  now_rain.innerHTML = `${
    state.currentWeather.main.rain ? state.currentWeather.main.rain : "0"
  }%`;
  now_humidity.innerHTML = `${state.currentWeather.main.humidity}%`;
  now_sky.src = `./img/weather-icons-125x125/${state.currentWeather.weather[0].icon}.png`;
  now_wind.innerHTML = `${Math.round(
    state.currentWeather.wind.speed * 3.6
  )}kmh/h`;

  // SUNRISE-/SET
  sunriseEl.innerHTML = `${state.currentWeather.sys.sunrise} Uhr`;
  sunsetEl.innerHTML = `${state.currentWeather.sys.sunset} Uhr`;
}

// Eventlistener

displayDropDownBtn.addEventListener("click", displayDropDownMEnu);
closeDropDownBtn.addEventListener("click", closeDropDownMenu);

dropDownSearchBtn.addEventListener("click", async () => {
  const inputFieldValue = document.querySelector(
    ".drop-down-menu__searchfield"
  );
  state.query = inputFieldValue.value;

  // GEOCODING
  const geoData = await fetchData(URL.geocoding(state.query));
  if (geoData) state.locationsList = geoData;
  else {
    state.message = "Eingabe ungültig!";
    console.log(state.message);
  }

  createHtmlListEntries(location);
  inputFieldValue.value = "";

  dropDownList.addEventListener("click", async (e) => {
    const el = e.target;
    if (!el) return;

    const lat = el.dataset.lat;
    const lon = el.dataset.lon;

    // CURRENT WEATHER
    // const weatherData = await fetchData(URL.currentWeather(lat, lon));
    state.currentWeather = await fetchData(URL.currentWeather(lat, lon));

    updateDOM();
    closeDropDownMenu();
    clearDropDownList();
    console.log(state);

    // state.forecast = await fetchData(URL.forecast(lat, lon));
    // state.airPollution = await fetchData(URL.airPollution(lat, lon));
  });
});

// function mpsToKmh(mps) {
//   const mph = mps * 1000;
//   return mph / 1000;
// }
