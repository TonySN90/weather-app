"use strict";

import "./../scss/main.scss";
import { fetchData, URL } from "./api";
import { getDate, getTime } from "./utils";

const headerImage = document.querySelector(".header__image");

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
const now_airPressure = document.querySelector(
  ".now-section__air-pressure-value"
);
const now_humidity = document.querySelector(".humidity__value");
const now_wind = document.querySelector(".wind-informations__value");
const now_sky = document.querySelector(".sky-informations-image");
const now_description = document.querySelector(
  ".now-section__weather-description"
);

const hourlyForcastEl = document.querySelector(".hourly-forecast__list");
const fiveDaysForcastEl = document.querySelector(".five-days-forecast__list");

const qualityIndexSpanEl = document.querySelector(
  ".air-pollution__quality-index > span"
);
const no2El = document.querySelector(".air-pollution__no2-value");
const pm10El = document.querySelector(".air-pollution__pm10-value");
const pm25El = document.querySelector(".air-pollution__pm2_5-value");
const o3El = document.querySelector(".air-pollution__o3-value");

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
       <div class="forecast__rain-probability">${(
         forecast.pop * 100
       ).toFixed()}%</div>
    </div>
  </li>`;
}

function filterMaxTemperatureDay() {
  const maxTempByDay = {};

  state.forecast.list.forEach((entry) => {
    const date = entry.dt_txt.split(" ")[0]; // extract the date
    const temp = entry.main.temp; // get the temperature

    // Check if there is already an entry for this day
    if (!maxTempByDay[date] || temp > maxTempByDay[date].maxTemp) {
      maxTempByDay[date] = {
        maxTemp: temp,
        weatherEntry: entry,
      };
    }
  });

  // Extract the weather entries of the days with maximum temperature
  const maxTempDays = Object.values(maxTempByDay).map(
    (day) => day.weatherEntry
  );

  return maxTempDays;
}

function customizeTheme() {
  const themeColors = {
    "01d": "#282623",
    "01n": "#00172D",
    "02d": "#260C0D",
    "02n": "#000",
    "03d": "#204770",
    "03n": "",
    "04d": "#000",
    "04n": "#000",
    "09d": "#204770",
    "09n": "#204770",
    "10d": "#000",
    "10n": "#132F43",
    "11d": "#000",
    "11n": "#000",
    "13d": "#E3ECF7",
    "13n": "#000",
    "50d": "#000",
    "50n": "#000",
  };

  // const iconId = state.currentWeather.weather[0].icon;
  const iconId = "02d";
  console.log(iconId);
  headerImage.style.backgroundImage = `url(./../img/header-bg/header__bg-small_${iconId}-01.png)`;

  document.body.style.backgroundColor = themeColors[iconId];
  // document.styleSheets[0].cssRules[0].style.backgroundColor = 'red';
  console.log(document.styleSheets);
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
  now_airPressure.innerHTML = `${state.currentWeather.main.pressure}hPa`;
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

  // AIR-POLLUTION

  const aqi = {
    quality: {
      1: "sehr gut",
      2: "gut",
      3: "moderat",
      4: "schlecht",
      5: "sehr schlecht",
    },

    colors: {
      1: "#006634",
      2: "#3BAA34",
      3: "#fed330",
      4: "#FF5050",
      5: "#960032",
    },
  };

  const aqiValue = aqi.quality[state.airPollution.list[0].main.aqi];
  qualityIndexSpanEl.innerHTML = `${aqiValue}`;
  qualityIndexSpanEl.style.backgroundColor =
    aqi.colors[state.airPollution.list[0].main.aqi];

  no2El.innerHTML = `${state.airPollution.list[0].components.no2.toFixed(
    2
  )} μg/m3`;
  pm10El.innerHTML = `${state.airPollution.list[0].components.pm10.toFixed(
    2
  )} μg/m3`;
  pm25El.innerHTML = `${state.airPollution.list[0].components.pm2_5.toFixed(
    2
  )} μg/m3`;
  o3El.innerHTML = `${state.airPollution.list[0].components.o3.toFixed(
    2
  )} μg/m3`;

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
      state.airPollution = await fetchData(URL.airPollution(lat, lon));
      // state.map = await fetchData(URL.map(lat, lon));
      console.log(state);
      customizeTheme();

      clearForecastList();
      updateDOM();
      closeDropDownMenu();
      clearDropDownList();
    });
  } catch (error) {
    displayErrorMessage("Keinen Ort gefunden!");
    console.log(`Errormeldung: ${error}`);
  }
});

const themeColors = {
  "01d": "#fff",
  "01n": "#fff",
};

console.log(themeColors["01d"]);
