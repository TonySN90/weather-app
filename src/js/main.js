"use strict";

import "./../scss/main.scss";
import { fetchData, URL } from "./api";
import { getDate, getTime } from "./utils";

const headerImage = document.querySelector(".header__image");

const displayDropDownBtn = document.querySelector(".current-location__button");
const dropDownEl = document.querySelector(".drop-down");
const dropDownList = document.querySelector(".drop-down__search-list");
const inputFieldValue = document.querySelector(".drop-down__searchfield");
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

const themesContainer = document.querySelector(".themes__container");

const state = {
  currentLocation: {
    locationName: "Schwerin",
    lat: "53.6288297",
    lon: "11.4148038",
  },
  query: "",
  currentWeather: [],
  forecast: [],
  locationsList: [],
  currentTheme: "03",
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
  dropDownEl.style.top = "-40rem";
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

// THEMES

const themes = [
  {
    id: "01",
    name: "dreamy lake view",
    mainColor: "#282623",
    secondaryColor: "#F7BDAC",
    fontColor: "#282623",
    picture: "dreamy-lake-small",
  },

  {
    id: "02",
    name: "beautiful mountains",
    mainColor: "#260C0D",
    secondaryColor: "#FDD7A8",
    fontColor: "#260C0D",
    picture: "beautiful-mountains-small",
  },
  {
    id: "03",
    name: "awakening city",
    mainColor: "#12031E",
    secondaryColor: "#918EED",
    fontColor: "#12031E",
    picture: "awakening-city",
  },
  {
    id: "04",
    name: "sunset",
    mainColor: "#1E203D",
    secondaryColor: "#F36281",
    fontColor: "#1E203D",
    picture: "sunset",
  },
];

function listAllThemes() {
  themes.forEach((theme) => {
    const htmlMarkup = `<div class="themes__container-theme" data-id="${theme.id}">${theme.name}</div>`;
    themesContainer.insertAdjacentHTML("beforeend", htmlMarkup);
  });
}

function setTheme() {
  const themeColors = {
    "01d": "#282623",
    "01n": "#00172D",
    "02d": "#A44900",
    "02n": "#000",
    "03d": "#260C0D",
    "03n": "#132F43",
    "04d": "#204770",
    "04n": "#091523",
    "09d": "#1F2035",
    "09n": "#000",
    "10d": "#F3D8B5",
    "10n": "#1E203D",
    "11d": "#12031E",
    "11n": "#060600",
    "13d": "#E3ECF7",
    "13n": "#191F3F",
    "50d": "#000",
    "50n": "#000",
  };

  const currentTheme = themes.find((theme) => theme.id == state.currentTheme);
  const themesEl = document.querySelectorAll(".themes__container-theme");

  headerImage.style.backgroundImage = `url(./../img/theme-images/${currentTheme.picture}.png)`;
  document.body.style.backgroundColor = currentTheme.mainColor;
  locationName.style.color = currentTheme.mainColor;
  locationTime.style.color = currentTheme.mainColor;
  displayDropDownBtn.querySelector(".icon--middle").style.color =
    currentTheme.mainColor;
  inputFieldValue.style.backgroundColor = currentTheme.mainColor;
  dropDownSearchBtn.style.backgroundColor = currentTheme.mainColor;
  document
    .querySelectorAll(".drop-down__list-entry")
    .forEach((el) => (el.style.backgroundColor = currentTheme.mainColor));

  themesEl.forEach((el, i) => {
    el.style.border = `3px solid ${currentTheme.mainColor}`;
    el.style.backgroundImage = `url(./../img/theme-images/${themes[i].picture}.png)`;
    console.log(el.dataset.id, themes[i].picture);
  });

  themesEl.forEach((theme) => {
    if (theme.dataset.id == state.currentTheme)
      theme.style.border = `3px solid ${currentTheme.secondaryColor}`;
  });
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

function safeThemeInLocalStorage(themeId) {
  localStorage.setItem("weatherTheme", JSON.stringify(themeId));
}

function loadDataFromLocalStorage() {
  const themeId = JSON.parse(localStorage.getItem("weatherTheme"));
  if (themeId) state.currentTheme = themeId;
}

async function init() {
  loadDataFromLocalStorage();
  listAllThemes();
  setTheme();

  state.currentWeather = await fetchData(
    URL.currentWeather(state.currentLocation.lat, state.currentLocation.lon)
  );
  state.forecast = await fetchData(
    URL.forecast(state.currentLocation.lat, state.currentLocation.lon)
  );
  state.airPollution = await fetchData(
    URL.airPollution(state.currentLocation.lat, state.currentLocation.lon)
  );

  updateDOM();
}

init();

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
    const inputFieldValue = document.querySelector(".drop-down__searchfield");
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
      console.log(state);
      setTheme();

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

themesContainer.addEventListener("click", (e) => {
  const el = e.target.closest(".themes__container-theme");
  if (!el) return;

  const selectedId = el.dataset.id;
  state.currentTheme = selectedId;
  setTheme();
  // setActiveTheme(el);
  closeDropDownMenu();
  safeThemeInLocalStorage(selectedId);
});
