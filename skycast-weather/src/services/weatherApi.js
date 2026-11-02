
import axios from "axios";

const GEO_URL =
  "https://geocoding-api.open-meteo.com/v1/search";

const WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast";

// Step 1: Get city coordinates
export const getCoordinates = async (city) => {
  const response = await axios.get(GEO_URL, {
    params: {
      name: city,
      count: 5,
      language: "en",
      format: "json"
    }
  });

  if (!response.data.results?.length) {
    throw new Error("City not found. Try another city.");
  }

  return response.data.results[0];
};

// Step 2: Get weather using coordinates
export const getWeather = async (latitude, longitude) => {
  const response = await axios.get(WEATHER_URL, {
    params: {
      latitude,
      longitude,

      current: [
        "temperature_2m",
        "relative_humidity_2m",
        "apparent_temperature",
        "is_day",
        "precipitation",
        "weather_code",
        "wind_speed_10m"
      ].join(","),

      hourly: [
        "temperature_2m",
        "precipitation_probability",
        "relative_humidity_2m"
      ].join(","),

      daily: [
        "temperature_2m_max",
        "temperature_2m_min",
        "weather_code",
        "sunrise",
        "sunset",
        "uv_index_max"
      ].join(","),

      timezone: "auto",
      forecast_days: 7
    }
  });

  return response.data;
};

// Step 3: Combine both API requests
export const getWeatherByCity = async (city) => {
  const location = await getCoordinates(city);

  const weather = await getWeather(
    location.latitude,
    location.longitude
  );

  return {
    location,
    weather
  };
};
