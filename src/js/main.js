"use strict";

import "./../scss/main.scss";
import { fetchData, URL } from "./api";
import { getDate, getTime } from "./utils";

const displayDropDownBtn = document.querySelector(".current-location__button");
const dropDownEl = document.querySelector(".drop-down");
const dropDownList = document.querySelector(".drop-down__li");
const inputFieldValue = document.querySelector(".drop-down-menu__searchfield");
const dropDownSearchBtn = document.querySelector(".drop-down__search_button");
const closeDropDownBtn = document.querySelector(".drop-down__close-button");

const locationName = document.querySelector(".header__location-city");
const locationTime = document.querySelector(".header__location-time");

const now_temperature = document.querySelector(".now-section__temperature");
const now_feelsLike = document.querySelector(".now-section__feelsLike");
const now_rain = document.querySelector(".now-section__rain-probability");
const now_humidity = document.querySelector(".humidity__value");
const now_wind = document.querySelector(".wind-informations__value");
const now_sky = document.querySelector(".sky-informations-image");
const now_description = document.querySelector(
  ".now-section__weather-description"
);

const hourlyForcastEl = document.querySelector(".hourly-forecast__list");
const fiveDaysForcastEl = document.querySelector(".five-days-forecast__list");

const sunriseEl = document.querySelector(".sunrise__time");
const sunsetEl = document.querySelector(".sunset__time");

const state = {
  query: "",
  currentLocation: "",
  currentWeather: [],
  forecast: [],
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
  dropDownEl.style.top = "-30rem";
}

function clearDropDownList() {
  dropDownList.innerHTML = "";
}

function clearForecastList() {
  document
    .querySelectorAll(".forecast__list-card")
    .forEach((el) => el.remove());
}

function displayErrorMessage(message) {
  inputFieldValue.value = message;
  inputFieldValue.style.color = "red";
  setTimeout(() => {
    inputFieldValue.style.color = "#ffffffc1";
    inputFieldValue.value = "";
  }, 2000);
}

function createForcastListentry(forecast, date = true) {
  return `
  <li class="forecast__list-card">
    <div class="forecast__time">${
      date ? getTime(forecast.dt, false) : getDate(forecast.dt, false, true)
    }</div>
    <div class="informations__container">
      <img src="./img/weather-icons-125x125/${
        forecast.weather[0].icon
      }.png" alt="weather Icon" class="forecast__icon" />
      <div class="forecast__temperature">${Math.round(
        forecast.main.temp
      )}°C</div>
    </div>
    <div class="informations__container">
      <i class="fa-solid fa-wind icon"></i>
      <div class="forecast__windinformationens">${Math.round(
        forecast.wind.speed * 3.6
      )}kmh/h</div>
    </div>
    <div class="informations__container">
      <i class="fa-solid fa-umbrella icon"></i>
       <div class="forecast__rain-probability">${forecast.pop * 100}%</div>
    </div>
  </li>`;
}

function filterMaxTemperatureDay() {
  const maxTempByDay = {};

  // Durchlaufe das Wetterdaten-Array
  state.forecast.list.forEach((entry) => {
    const date = entry.dt_txt.split(" ")[0]; // Extrahiere das Datum
    const temp = entry.main.temp; // Hole die Temperatur

    // Überprüfe, ob es bereits einen Eintrag für diesen Tag gibt
    if (!maxTempByDay[date] || temp > maxTempByDay[date].maxTemp) {
      maxTempByDay[date] = {
        maxTemp: temp,
        weatherEntry: entry,
      };
    }
  });

  // Extrahiere die Wettereinträge der Tage mit maximaler Temperatur
  const maxTempDays = Object.values(maxTempByDay).map(
    (day) => day.weatherEntry
  );

  return maxTempDays;
}

function updateDOM() {
  // HEADER
  locationName.innerHTML = state.currentWeather.name;
  locationTime.innerHTML = getDate(
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

  // HOURLY FORCAST
  const forcast24Hours = state.forecast.list.slice(0, 8);
  forcast24Hours.forEach((el) => {
    const listEntry = createForcastListentry(el);
    hourlyForcastEl.insertAdjacentHTML("beforeend", listEntry);
  });

  // 5-DAY FORCAST
  const maxTempDays = filterMaxTemperatureDay();
  maxTempDays.forEach((el) => {
    const listEntry = createForcastListentry(el, false);
    fiveDaysForcastEl.insertAdjacentHTML("beforeend", listEntry);
  });
  document
    .querySelector(".five-days-forecast__list")
    .firstElementChild.querySelector(".forecast__time").innerHTML = "Morgen";

  // SUNRISE-/SET
  sunriseEl.innerHTML = `${getTime(
    state.currentWeather.sys.sunrise,
    state.currentWeather.timezone
  )} Uhr`;
  sunsetEl.innerHTML = `${getTime(
    state.currentWeather.sys.sunset,
    state.currentWeather.timezone
  )} Uhr`;
}

// Eventlistener

displayDropDownBtn.addEventListener("click", displayDropDownMEnu);
closeDropDownBtn.addEventListener("click", () => {
  closeDropDownMenu();
  setTimeout(() => {
    clearDropDownList();
  }, 500);
});

dropDownSearchBtn.addEventListener("click", async () => {
  clearDropDownList();
  try {
    const inputFieldValue = document.querySelector(
      ".drop-down-menu__searchfield"
    );
    state.query = inputFieldValue.value;

    // GEOCODING
    state.locationsList = await fetchData(URL.geocoding(state.query));
    createHtmlListEntries(location);
    inputFieldValue.value = "";

    dropDownList.addEventListener("click", async (e) => {
      const el = e.target;
      if (!el) return;

      const lat = el.dataset.lat;
      const lon = el.dataset.lon;

      // CURRENT WEATHER
      state.currentWeather = await fetchData(URL.currentWeather(lat, lon));
      state.forecast = await fetchData(URL.forecast(lat, lon));
      // state.airPollution = await fetchData(URL.airPollution(lat, lon));

      clearForecastList();
      updateDOM();
      closeDropDownMenu();
      clearDropDownList();
      console.log(state);
    });
  } catch (error) {
    displayErrorMessage("Keinen Ort gefunden!");
    console.log(`Errormeldung: ${error}`);
  }
});
