import "./../scss/main.scss";

// const locationInput = document.getElementById("locationInput");
// const weatherContainer = document.getElementById("weatherContainer");
// const searchBtn = document.querySelector("#search--button");

// const state = {
//   location: "",
//   temperature: "",
//   weatherCondition: "",
// };

// const URL =
//   "https://api.meteomatics.com/2023-12-12T23:30:00.000+01:00/t_2m:C/53.6288297,11.4148038/json?model=dwd-icon-global";
// const API_KEY = "3f7d15f8a87ecf63772b7fcd776a2c91";

// function searchLocation() {
//   state.location = locationInput.value;
// }

// async function getDataFromAPI() {
//   const response = await fetch(URL);
//   const results = await JSON.parse(response);
//   console.log(results);
// }

// const weatherInfo = `
//       <h2>Wetter in ${state.location}</h2>
//       <p>Temperatur: ${state.temperature}</p>
//       <p>Wetterlage: ${state.weatherCondition}</p>
//   `;

// // weatherContainer.innerHTML = weatherInfo;

// searchBtn.addEventListener("click", () => {
//   // searchLocation();
//   console.log(state.location);
//   // getDataFromAPI();
// });
