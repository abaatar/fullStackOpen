import axios from "axios";
const api_key = process.env.REACT_APP_API_KEY;
const baseUrl = (cityName) =>
  `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${api_key}`;

const getWeather = (cityName) => {
  const request = axios.get(baseUrl(cityName));
  return request.then((response) => response.data);
};

export default { getWeather };
