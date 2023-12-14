import "./../scss/main.scss";

const searchBtn = document.querySelector(".current-location__button");

const state = {
  location: "",
};

const API_KEY = "3f7d15f8a87ecf63772b7fcd776a2c91";

async function getDataFromAPI() {
  try {
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=${API_KEY}`
    );
    // const response = await fetch(
    //   `http://api.openweathermap.org/geo/1.0/direct?q=${state.location}&limit=5&appid=${API_KEY}`
    // );
    const result = await JSON.parse(response);
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

// function clearInputField() {
//   inputFieldEl.value = "";
// }

searchBtn.addEventListener("click", async () => {
  const inputFieldEl = document.querySelector(".search-view--input");
  state.location = inputFieldEl.value;

  console.log(state.location);
  // await getDataFromAPI();

  //   clearInputField();
});
