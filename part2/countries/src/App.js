import { useState, useEffect } from "react";
import query from "./services/query";
import weather from "./services/weather";

const Weather = ({ country }) => {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    if (country) {
      weather.getWeather(country.capital).then((response) => {
        setWeatherData(response);
      });
    }
  }, []);

  if (!weatherData) return;

  const linkLogo = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;

  return (
    <div>
      <h2>Weather in {country.capital}</h2>
      temperature {weatherData.main.temp} Celcius
      <div>
        <img src={linkLogo} alt="logo" />
      </div>
      wind {weatherData.wind.speed} m/s
    </div>
  );
};

const Country = ({ country }) => {
  if (!country) return;

  return (
    <div>
      <h1>{country.name.common}</h1>
      capital {country.capital}
      <br />
      area {country.area}
      <h3>languages</h3>
      <ul>
        {Object.values(country.languages).map((lan) => (
          <li key={lan}>{lan}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt} />
      <Weather country={country} />
    </div>
  );
};

const Display = ({ result, setResult }) => {
  const [country, setCountry] = useState(null);

  const handleClick = ({ x }) => {
    query.getCountry(x).then((response) => {
      setResult([x]);
    });
  };

  if (result.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  }
  if (result.length > 1) {
    return (
      <div>
        {result.map((x) => (
          <p key={x}>
            {x} <button onClick={() => handleClick({ x })}>show</button>
          </p>
        ))}
      </div>
    );
  }
  if (result.length === 1) {
    query.getCountry(result[0]).then((response) => {
      setCountry(response);
    });
    return <Country country={country} />;
  }
  return null;
};

const App = () => {
  const [value, setValue] = useState("");
  const [result, setResult] = useState([]);
  const [allName, setAllName] = useState([]);

  useEffect(() => {
    query.getAllName().then((response) => {
      setAllName(response);
    });
  }, []);

  useEffect(() => {
    if (value && allName.length > 0) {
      const temp = value.toLowerCase();
      setResult(allName.filter((name) => name.toLowerCase().includes(temp)));
    }
  }, [value]);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div>
      find countries <input value={value} onChange={handleChange} />
      <Display result={result} setResult={setResult} />
    </div>
  );
};

export default App;
