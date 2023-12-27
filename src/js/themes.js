const displayDropDownBtn = document.querySelector(".current-location__button");
const bookmarkBtn = document.querySelector(".bookmark__button");

const themesContainer = document.querySelector(".themes__content");
const headerImage = document.querySelector(".header__image");

const locationName = document.querySelector(".header__location-city");
const locationSubName = document.querySelector(".header__location-city-sub");
const locationTime = document.querySelector(".header__location-time");

const inputFieldValue = document.querySelector(".drop-down__searchfield");
const dropDownSearchBtn = document.querySelector(".drop-down__search_button");
const moduls = document.querySelectorAll(".modul--blur");

export const themes = [
  {
    id: "01",
    name: "dreamy lake view",
    mainColor: "#282623",
    secondaryColor: "#F7BDAC",
    headerFontColor: "#282623",
    mainFontColor: "#ffffffc1",
    modulColor: "#ffffff0d",
    picture: "dreamy-lake-small",
  },

  {
    id: "02",
    name: "beautiful mountains",
    mainColor: "#260C0D",
    secondaryColor: "#FDD7A8",
    headerFontColor: "#260C0D",
    mainFontColor: "#ffffffc1",
    modulColor: "#ffffff0d",
    picture: "beautiful-mountains-small",
  },
  {
    id: "03",
    name: "awakening city",
    mainColor: "#12031E",
    secondaryColor: "#918EED",
    headerFontColor: "#ffffffc1",
    mainFontColor: "#ffffffc1",
    modulColor: "#ffffff0d",
    picture: "awakening-city",
  },
  {
    id: "04",
    name: "sunset",
    mainColor: "#1E203D",
    secondaryColor: "#F36281",
    headerFontColor: "#ffffffc1",
    mainFontColor: "#ffffffc1",
    modulColor: "#ffffff0d",
    picture: "sunset",
  },
  {
    id: "05",
    name: "beach",
    mainColor: "#F3D8B5",
    secondaryColor: "#BAE5F6",
    headerFontColor: "#907311",
    mainFontColor: "#907311",
    modulColor: "#90721152",
    picture: "beach",
  },
  {
    id: "06",
    name: "sidney",
    mainColor: "#060600",
    secondaryColor: "#D36A00",
    headerFontColor: "#ffffffc1",
    mainFontColor: "#ffffffc1",
    modulColor: "#ffffff0d",
    picture: "sidney",
  },
  {
    id: "07",
    name: "lila",
    mainColor: "#1F2035",
    secondaryColor: "#D0BADE",
    headerFontColor: "#5C517B",
    mainFontColor: "#ffffffc1",
    modulColor: "#ffffff0d",
    picture: "lila",
  },
  {
    id: "08",
    name: "spooky",
    mainColor: "#000",
    secondaryColor: "#D0BADE",
    headerFontColor: "#ffffffc1",
    mainFontColor: "#ffffffc1",
    modulColor: "#a6596148",
    picture: "spooky",
  },
  {
    id: "09",
    name: "blue-night",
    mainColor: "#00172D",
    secondaryColor: "#C0C0E1",
    headerFontColor: "#ffffffc1",
    mainFontColor: "#ffffffc1",
    modulColor: "#ffffff0d",
    picture: "blue-night",
  },
  {
    id: "10",
    name: "green-night",
    mainColor: "#132F43",
    secondaryColor: "#45A6B1",
    headerFontColor: "#ffffffc1",
    mainFontColor: "#ffffffc1",
    modulColor: "#ffffff0d",
    picture: "green-night",
  },
];

export function listAllThemes() {
  themes.forEach((theme) => {
    const htmlMarkup = `<div class="themes__content-theme" data-id="${theme.id}"></div>`;
    themesContainer.insertAdjacentHTML("beforeend", htmlMarkup);
  });
}

export function setTheme(state) {
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
