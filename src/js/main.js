"use strict";

import "./../scss/main.scss";
import { fetchData, URL } from "./api";
import { getDate, getTime, filterMaxTemperatureDay } from "./utils";
import { listAllThemes, setTheme } from "./themes";
import { DEFAULT_LOCATION } from "./config";
import { v4 as uuidv4 } from "uuid";

const displayDropDownBtn = document.querySelector(".current-location__button");
const bookmarkBtn = document.querySelector(".bookmark__button");

const dropDownEl = document.querySelector(".drop-down");
const dropDownList = document.querySelector(".drop-down__search-list");
const dropDownBookmarksList = document.querySelector(
  ".drop-down__favourites-list"
);
const dropDownBookmarksTitle = document.querySelector(
  ".drop-down__favourites-title"
);
const inputFieldValue = document.querySelector(".drop-down__searchfield");
const dropDownSearchBtn = document.querySelector(".drop-down__search_button");
const closeDropDownBtn = document.querySelector(".drop-down__close-button");

const locationName = document.querySelector(".header__location-city");
const locationSubName = document.querySelector(".header__location-city-sub");
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

const themesContainer = document.querySelector(".themes__content");

const state = {
  currentLocation: DEFAULT_LOCATION,
  bookmarkedList: [],
  query: "",
  currentWeather: [],
  forecast: [],
  locationsList: [],
  currentTheme: "03",
};

function validateLocationsList(list) {
  list.forEach((el) => {
    el.id = uuidv4();
    el.bookmarked = false;
    el.state = el.state || "";
  });

  return list;
}

function updateBookmarkDomList(inputList, outputList) {
  outputList.innerHTML = "";

  dropDownBookmarksTitle.innerHTML =
    state.bookmarkedList.length == 0
      ? `Deine Standorte <br />
  <br />
  <i>Du hast noch keine Standorte hinzugefügt.</i>`
      : `Deine Standorte`;

  inputList.forEach((location) => {
    const listEntry = `<li class="drop-down__list-entry" data-id="${
      location.id
    }" data-bookmarked="${location.bookmarked}" data-lat="${
      location.lat
    }" data-lon="${location.lon}" data-name="${location.name}" data-state="${
      location.state
    }" data-country="${location.country}">${location.name} ${
      location.country
    } ${location.state ? location.state : ""}</li>`;
    outputList.insertAdjacentHTML("beforeend", listEntry);
  });
}

function findBookmarkEntry() {
  return state.bookmarkedList.find(
    (entry) =>
      entry.lon === state.currentLocation.lon &&
      entry.lat === state.currentLocation.lat
  );
}

function deleteBookmarkEntry() {
  const listEntry = findBookmarkEntry();

  state.bookmarkedList = state.bookmarkedList.filter(
    (entry) => entry !== listEntry
  );
}

function displayDropDownMEnu() {
  dropDownEl.style.top = "0";
}
function closeDropDownMenu() {
  dropDownEl.style.top = "-110%";
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

function createForecastListEntry(forecast, date = true) {
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

function displayHeader() {
  locationName.innerHTML = state.currentLocation.name;
  locationSubName.innerHTML = state.currentWeather.name;
  locationTime.innerHTML = getDate(
    state.currentWeather.dt,
    state.currentWeather.timezone
  );
}

function displayNowSection() {
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
}

function displayAQI() {
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
}

function displayHourlyForecast() {
  const forcast24Hours = state.forecast.list.slice(0, 8);
  forcast24Hours.forEach((el) => {
    const listEntry = createForecastListEntry(el);
    hourlyForcastEl.insertAdjacentHTML("beforeend", listEntry);
  });
}

function displayFiveDayForecast() {
  const maxTempDays = filterMaxTemperatureDay(state);
  maxTempDays.forEach((el) => {
    const listEntry = createForecastListEntry(el, false);
    fiveDaysForcastEl.insertAdjacentHTML("beforeend", listEntry);
  });
  document
    .querySelector(".five-days-forecast__list")
    .firstElementChild.querySelector(".forecast__time").innerHTML = "Morgen";
}

function displaySunriseSunset() {
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

function updateDOM() {
  displayHeader();
  displayNowSection();
  displayHourlyForecast();
  displayFiveDayForecast();
  displayAQI();
  displaySunriseSunset();
  changeBookmarkSign();
}

function safeThemeInLocalStorage(themeId) {
  localStorage.setItem("weatherTheme", JSON.stringify(themeId));
}

function safeBookmarkInLocalStorage() {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarkedList));
}

function loadDataFromLocalStorage() {
  const themeId = JSON.parse(localStorage.getItem("weatherTheme"));
  const bookmarks = JSON.parse(localStorage.getItem("bookmarks"));

  if (themeId) state.currentTheme = themeId;
  if (bookmarks) state.bookmarkedList = bookmarks;
}

async function fetchAllData(e, fromBookmarked = false, init = false) {
  try {
    let el = "";

    if (!init) {
      el = e.target;
      if (!el) return;
    }

    const lat = init ? e.lat : el.dataset.lat;
    const lon = init ? e.lon : el.dataset.lon;
    const idFromBookmarked = init ? e.id : el.dataset.id;

    // CURRENT WEATHER
    state.currentWeather = await fetchData(URL.currentWeather(lat, lon));
    state.forecast = await fetchData(URL.forecast(lat, lon));
    state.airPollution = await fetchData(URL.airPollution(lat, lon));

    state.currentLocation = {
      bookmarked: !fromBookmarked ? false : true,
      id: idFromBookmarked ? idFromBookmarked : uuidv4(),
      name: `${init ? e.name : el.dataset.name}`,
      lat: `${init ? e.lat : el.dataset.lat}`,
      lon: `${init ? e.lon : el.dataset.lon}`,
      state: `${init ? e.state : el.dataset.state}`,
      country: `${init ? e.country : el.dataset.country}`,
    };

    clearForecastList();
    updateDOM();
    closeDropDownMenu();
    clearDropDownList();
  } catch (error) {
    throw error;
  }
}

async function init() {
  loadDataFromLocalStorage();

  if (state.bookmarkedList.length !== 0) {
    state.currentLocation = state.bookmarkedList[0];
    fetchAllData(state.currentLocation, true, true);
  } else {
    fetchAllData(state.currentLocation, false, true);
  }
  updateBookmarkDomList(state.bookmarkedList, dropDownBookmarksList);
  listAllThemes();
  setTheme(state);
}

function changeBookmarkSign() {
  const isBookmarked = state.currentLocation.bookmarked;
  const bookmarkEl = bookmarkBtn.querySelector(".fa-bookmark");

  bookmarkEl.classList.toggle("fa-solid", isBookmarked);
  bookmarkEl.classList.toggle("fa-regular", !isBookmarked);
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
    const locationsList = await fetchData(URL.geocoding(state.query));
    state.locationsList = validateLocationsList(locationsList);
    updateBookmarkDomList(state.locationsList, dropDownList);

    inputFieldValue.value = "";
    setTheme(state);

    dropDownList.addEventListener("click", async (e) => {
      fetchAllData(e);
    });
  } catch (error) {
    displayErrorMessage("Keinen Ort gefunden!");
    console.log(`Errormeldung: ${error}`);
  }
});

dropDownBookmarksList.addEventListener("click", (e) => {
  const el = e.target.closest(".drop-down__list-entry");
  if (!el) return;
  fetchAllData(e, true);
});

themesContainer.addEventListener("click", (e) => {
  const el = e.target.closest(".themes__content-theme");
  if (!el) return;

  const selectedId = el.dataset.id;
  state.currentTheme = selectedId;
  setTheme(state);
  closeDropDownMenu();
  safeThemeInLocalStorage(selectedId);
});

bookmarkBtn.addEventListener("click", () => {
  const isBookmarked = state.currentLocation.bookmarked;

  function addBookmark() {
    state.bookmarkedList.push(state.currentLocation);
  }

  if (!isBookmarked) {
    addBookmark();
  } else if (isBookmarked) {
    deleteBookmarkEntry();
  }

  updateBookmarkDomList(state.bookmarkedList, dropDownBookmarksList);
  setTheme(state);
  state.currentLocation.bookmarked = !isBookmarked;
  changeBookmarkSign();
  safeBookmarkInLocalStorage();
});
