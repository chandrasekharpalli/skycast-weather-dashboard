
import { useEffect, useState } from "react";

import { getWeatherByCity } from "./services/weatherApi";

import {
  Search,
  MapPin,
  Wind,
  Droplets,
  Thermometer,
  CloudSun,
  RefreshCw
} from "lucide-react";

import "./App.css";

function getWeatherDescription(code) {
  if (code === 0) return "Clear Sky";
  if ([1, 2, 3].includes(code)) return "Partly Cloudy";
  if ([45, 48].includes(code)) return "Foggy";
  if ([51, 53, 55].includes(code)) return "Drizzle";
  if ([61, 63, 65].includes(code)) return "Rainy";
  if ([71, 73, 75].includes(code)) return "Snowfall";
  if ([80, 81, 82].includes(code)) return "Rain Showers";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";

  return "Unknown Weather";
}

function App() {
  const [city, setCity] = useState("Bhimavaram");

  const [weatherData, setWeatherData] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const fetchWeather = async (searchCity) => {
    if (!searchCity.trim()) {
      setError("Please enter a city name.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getWeatherByCity(searchCity);

      setWeatherData(data);

      setCity(data.location.name);
    } catch (err) {
      setError(
        err.response?.data?.reason ||
        err.message ||
        "Unable to fetch weather."
      );
    } finally {
      setLoading(false);
    }
  };

  // Load default city when application starts
  useEffect(() => {
    fetchWeather("Bhimavaram");
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeather(city);
  };

  const current = weatherData?.weather?.current;

  const location = weatherData?.location;

  return (
    <div className="app">

      <nav className="navbar">
        <h2>
          <CloudSun size={30} />
          SkyCast
        </h2>

        <span>Live Weather Dashboard</span>
      </nav>

      <main className="container">

        <form onSubmit={handleSearch} className="search-box">

          <Search size={20} />

          <input
            type="text"
            placeholder="Search city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            Search
          </button>

        </form>

        {loading && (
          <p className="status">
            <RefreshCw className="spin" size={20} />
            Fetching weather data...
          </p>
        )}

        {error && (
          <p className="error">{error}</p>
        )}

        {current && location && !loading && (

          <section className="weather-card">

            <div className="location">
              <MapPin size={20} />

              <h2>
                {location.name}, {location.admin1 || location.country}
              </h2>
            </div>

            <p className="weather-condition">
              {getWeatherDescription(current.weather_code)}
            </p>

            <div className="temperature">
              {Math.round(current.temperature_2m)}
              <span>°C</span>
            </div>

            <p className="feels-like">
              Feels like {current.apparent_temperature}°C
            </p>

            <div className="weather-details">

              <div className="detail">
                <Droplets size={25} />
                <p>Humidity</p>
                <h3>{current.relative_humidity_2m}%</h3>
              </div>

              <div className="detail">
                <Wind size={25} />
                <p>Wind Speed</p>
                <h3>{current.wind_speed_10m} km/h</h3>
              </div>

              <div className="detail">
                <Thermometer size={25} />
                <p>Precipitation</p>
                <h3>{current.precipitation} mm</h3>
              </div>

            </div>

            <p className="updated">
              Weather time: {current.time.replace("T", " ")}
            </p>

          </section>
        )}

      </main>

    </div>
  );
}

export default App;
