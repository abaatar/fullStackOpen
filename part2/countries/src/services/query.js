import axios from "axios";
const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api";

const getAllName = () => {
  const request = axios.get(`${baseUrl}/all`);
  return request.then((response) => response.data.map((x) => x.name.common));
};

const getCountry = (name) => {
  const request = axios.get(`${baseUrl}/name/${name}`);
  return request.then((response) => response.data);
};

export default { getAllName, getCountry };
