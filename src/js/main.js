"use strict";

import "./../scss/main.scss";
import { fetchData, URL } from "./api";
import { getDate } from "./utils";

const displayDropDownBtn = document.querySelector(".current-location__button");
const dropDownEl = document.querySelector(".drop-down");
const dropDownList = document.querySelector(".drop-down__li");
const inputFieldValue = document.querySelector(".drop-down-menu__searchfield");
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

const hourlyForcastEl = document.querySelector(".hourly-forecast__list");

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
  dropDownEl.style.top = "-30rem";
}

function clearDropDownList() {
  dropDownList.innerHTML = "";
}

function displayErrorMessage(message) {
  inputFieldValue.value = message;
  inputFieldValue.style.color = "red";
  setTimeout(() => {
    inputFieldValue.style.color = "#ffffffc1";
    inputFieldValue.value = "";
  }, 2000);
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

function createForcastListentry() {
  const html = `
  <li class="hourly-forecast__list-card forecast__list-card">
    <div class="forecast__time">3 Uhr</div>
    <div class="informations__container">
      <img src="./img/icon_fullsun.svg" alt="" class="forecast__icon" />
      <div class="forecast__temperature">15°C</div>
    </div>
    <div class="informations__container">
      <i class="fa-solid fa-wind icon"></i>
      <div class="forecast__windinformationens">10 km/h</div>
    </div>
    <div class="informations__container">
      <i class="fa-solid fa-umbrella icon"></i>
      <div class="forecast__rain-probability">60%</div>
    </div>
  </li>`;
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

      updateDOM();
      closeDropDownMenu();
      clearDropDownList();
      console.log(state);

      // state.forecast = await fetchData(URL.forecast(lat, lon));
      // state.airPollution = await fetchData(URL.airPollution(lat, lon));
    });
  } catch (error) {
    displayErrorMessage("Keinen Ort gefunden!");
    console.log(`Errormeldung: ${error}`);
  }
});
