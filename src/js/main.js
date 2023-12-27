"use strict";

import "./../scss/main.scss";
import { fetchData, URL } from "./api";
import { getDate, getTime } from "./utils";
import { themes } from "./themes";
import { v4 as uuidv4 } from "uuid";

const headerImage = document.querySelector(".header__image");

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
const moduls = document.querySelectorAll(".modul--blur");

const state = {
  currentLocation: {
    id: uuidv4(),
    name: "Berlin",
    lat: "52.5170365",
    lon: "13.3888599",
    country: "DE",
    state: "",
    bookmarked: false,
  },
  bookmarkedList: [],
  query: "",
  currentWeather: [],
  forecast: [],
  locationsList: [],
  currentTheme: "03",
};

function validateLocationslist(list) {
  list.forEach((el) => {
    el.id = uuidv4();
    el.bookmarked = false;
    el.state = el.state || "";
  });

  return list;
}

function updateHtmlListEntries(inputList, outputList) {
  outputList.innerHTML = "";

  dropDownBookmarksTitle.innerHTML =
    state.bookmarkedList.length == 0
      ? `Deine Standorte <br />
  <br />
  <i>Du hast noch keine Standorte hinzugefügt.</i>`
      : `Deine Standorte`;

  // console.log(inputList);
  inputList.forEach((location) => {
    // console.log(location.state);
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

function deleteListEntryFromArray() {
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

// const themes = [
//   {
//     id: "01",
//     name: "dreamy lake view",
//     mainColor: "#282623",
//     secondaryColor: "#F7BDAC",
//     headerFontColor: "#282623",
//     mainFontColor: "#ffffffc1",
//     modulColor: "#ffffff0d",
//     picture: "dreamy-lake-small",
//   },

//   {
//     id: "02",
//     name: "beautiful mountains",
//     mainColor: "#260C0D",
//     secondaryColor: "#FDD7A8",
//     headerFontColor: "#260C0D",
//     mainFontColor: "#ffffffc1",
//     modulColor: "#ffffff0d",
//     picture: "beautiful-mountains-small",
//   },
//   {
//     id: "03",
//     name: "awakening city",
//     mainColor: "#12031E",
//     secondaryColor: "#918EED",
//     headerFontColor: "#ffffffc1",
//     mainFontColor: "#ffffffc1",
//     modulColor: "#ffffff0d",
//     picture: "awakening-city",
//   },
//   {
//     id: "04",
//     name: "sunset",
//     mainColor: "#1E203D",
//     secondaryColor: "#F36281",
//     headerFontColor: "#ffffffc1",
//     mainFontColor: "#ffffffc1",
//     modulColor: "#ffffff0d",
//     picture: "sunset",
//   },
//   {
//     id: "05",
//     name: "beach",
//     mainColor: "#F3D8B5",
//     secondaryColor: "#BAE5F6",
//     headerFontColor: "#907311",
//     mainFontColor: "#907311",
//     modulColor: "#90721152",
//     picture: "beach",
//   },
//   {
//     id: "06",
//     name: "sidney",
//     mainColor: "#060600",
//     secondaryColor: "#D36A00",
//     headerFontColor: "#ffffffc1",
//     mainFontColor: "#ffffffc1",
//     modulColor: "#ffffff0d",
//     picture: "sidney",
//   },
//   {
//     id: "07",
//     name: "lila",
//     mainColor: "#1F2035",
//     secondaryColor: "#D0BADE",
//     headerFontColor: "#5C517B",
//     mainFontColor: "#ffffffc1",
//     modulColor: "#ffffff0d",
//     picture: "lila",
//   },
//   {
//     id: "08",
//     name: "spooky",
//     mainColor: "#000",
//     secondaryColor: "#D0BADE",
//     headerFontColor: "#ffffffc1",
//     mainFontColor: "#ffffffc1",
//     modulColor: "#a6596148",
//     picture: "spooky",
//   },
//   {
//     id: "09",
//     name: "blue-night",
//     mainColor: "#00172D",
//     secondaryColor: "#C0C0E1",
//     headerFontColor: "#ffffffc1",
//     mainFontColor: "#ffffffc1",
//     modulColor: "#ffffff0d",
//     picture: "blue-night",
//   },
//   {
//     id: "10",
//     name: "green-night",
//     mainColor: "#132F43",
//     secondaryColor: "#45A6B1",
//     headerFontColor: "#ffffffc1",
//     mainFontColor: "#ffffffc1",
//     modulColor: "#ffffff0d",
//     picture: "green-night",
//   },
// ];

function listAllThemes() {
  themes.forEach((theme) => {
    const htmlMarkup = `<div class="themes__content-theme" data-id="${theme.id}"></div>`;
    themesContainer.insertAdjacentHTML("beforeend", htmlMarkup);
  });
}

function setTheme() {
  const currentTheme = themes.find((theme) => theme.id == state.currentTheme);
  const themesEl = document.querySelectorAll(".themes__content-theme");

  headerImage.style.backgroundImage = `url(./../img/theme-images/${currentTheme.picture}.png)`;
  document.body.style.backgroundColor = currentTheme.mainColor;
  document.body.style.color = currentTheme.mainFontColor;

  locationName.style.color = currentTheme.headerFontColor;
  locationSubName.style.color = currentTheme.headerFontColor;
  locationTime.style.color = currentTheme.headerFontColor;

  displayDropDownBtn.querySelector(
    ".current-location__button > i"
  ).style.color = currentTheme.headerFontColor;

  bookmarkBtn.querySelector(".bookmark__button > i").style.color =
    currentTheme.headerFontColor;

  inputFieldValue.style.backgroundColor = currentTheme.mainColor;
  dropDownSearchBtn.style.backgroundColor = currentTheme.mainColor;
  document
    .querySelectorAll(".drop-down__list-entry")
    .forEach((el) => (el.style.backgroundColor = currentTheme.mainColor));

  themesEl.forEach((el, i) => {
    el.style.border = `3px solid ${currentTheme.mainColor}`;
    el.style.backgroundImage = `url(./../img/theme-images/${themes[i].picture}.png)`;
    el.style.background = `"url(./../img/theme-images/sunset.png" 50% / cover no-repeat
    fixed`;
  });

  themesEl.forEach((theme) => {
    if (theme.dataset.id == state.currentTheme)
      theme.style.border = `3px solid ${currentTheme.secondaryColor}`;
  });

  moduls.forEach(
    (module) => (module.style.backgroundColor = `${currentTheme.modulColor}`)
  );
}

function updateDOM() {
  // HEADER

  locationName.innerHTML = state.currentLocation.name;
  locationSubName.innerHTML = state.currentWeather.name;
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
    const listEntry = createForecastListEntry(el);
    hourlyForcastEl.insertAdjacentHTML("beforeend", listEntry);
  });

  // 5-DAY FORCAST
  const maxTempDays = filterMaxTemperatureDay();
  maxTempDays.forEach((el) => {
    const listEntry = createForecastListEntry(el, false);
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

  //BOOKMARK-Sign
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
  updateHtmlListEntries(state.bookmarkedList, dropDownBookmarksList);
  listAllThemes();
  setTheme();
  console.log(state);
}

function changeBookmarkSign() {
  const isBookmarked = state.currentLocation.bookmarked;
  const bookmarkEl = bookmarkBtn.querySelector(".fa-bookmark");

  if (isBookmarked) {
    bookmarkEl.classList.add("fa-solid");
    bookmarkEl.classList.remove("fa-regular");
  } else {
    bookmarkEl.classList.remove("fa-solid");
    bookmarkEl.classList.add("fa-regular");
  }
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
    state.locationsList = validateLocationslist(locationsList);
    updateHtmlListEntries(state.locationsList, dropDownList);

    inputFieldValue.value = "";
    setTheme();

    dropDownList.addEventListener("click", async (e) => {
      fetchAllData(e);
    });
  } catch (error) {
    displayErrorMessage("Keinen Ort gefunden!");
    console.log(`Errormeldung: ${error}`);
  }
  console.log(state);
});

dropDownBookmarksList.addEventListener("click", (e) => {
  const el = e.target.closest(".drop-down__list-entry");
  if (!el) return;
  fetchAllData(e, true);
  console.log(state);
});

themesContainer.addEventListener("click", (e) => {
  const el = e.target.closest(".themes__content-theme");
  if (!el) return;

  const selectedId = el.dataset.id;
  state.currentTheme = selectedId;
  setTheme();
  closeDropDownMenu();
  safeThemeInLocalStorage(selectedId);
});

bookmarkBtn.addEventListener("click", () => {
  const isBookmarked = state.currentLocation.bookmarked;

  if (!isBookmarked) {
    state.bookmarkedList.push(state.currentLocation);
    updateHtmlListEntries(state.bookmarkedList, dropDownBookmarksList);
    setTheme();
  } else if (isBookmarked) {
    deleteListEntryFromArray();
    updateHtmlListEntries(state.bookmarkedList, dropDownBookmarksList);
    setTheme();
  }
  state.currentLocation.bookmarked = !isBookmarked;
  changeBookmarkSign();
  safeBookmarkInLocalStorage();
});

// const deletedArrayElement = deleteListEntryFromArray();
// deleteHtmlListEntries(deletedArrayElement);
