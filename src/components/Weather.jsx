import { useEffect, useState } from "react";

import {
  Cloud,
  CloudRain,
  CloudSnow,
  CloudSun,
  Droplets,
  MapPin,
  RefreshCw,
  Search,
  Sun,
  Wind,
  Thermometer,
  Shirt,
} from "lucide-react";

import "./Weather.css";

function Weather() {
  const [city, setCity] = useState("Kabul");
  const [searchCity, setSearchCity] = useState("");
  const [weather, setWeather] = useState(null);

  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] =
    useState(false);

  const [error, setError] = useState("");

  const [temperatureUnit, setTemperatureUnit] =
    useState("C");

  /* =====================================================
     LOAD WEATHER BY CITY
  ===================================================== */

  const loadWeather = async (locationName = "Kabul") => {
    const cleanLocation =
      locationName.trim() || "Kabul";

    setLoading(true);
    setError("");

    try {
      /* -----------------------------
         FIND CITY
      ----------------------------- */

      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          cleanLocation
        )}&count=1&language=en&format=json`
      );

      if (!geoResponse.ok) {
        throw new Error(
          "Unable to search for the city."
        );
      }

      const geoData = await geoResponse.json();

      if (
        !geoData.results ||
        geoData.results.length === 0
      ) {
        throw new Error(
          `City "${cleanLocation}" was not found.`
        );
      }

      const location = geoData.results[0];

      /* -----------------------------
         GET WEATHER
      ----------------------------- */

      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=celsius&wind_speed_unit=kmh&forecast_days=7&timezone=auto`
      );

      if (!weatherResponse.ok) {
        throw new Error(
          "Unable to load weather data."
        );
      }

      const data = await weatherResponse.json();

      const current = data.current;
      const daily = data.daily;

      const forecast = daily.time.map(
        (date, index) => ({
          date,

          day: getDayName(date, index),

          high:
            daily.temperature_2m_max[index],

          low:
            daily.temperature_2m_min[index],

          condition:
            getWeatherCondition(
              daily.weather_code[index]
            ),

          icon:
            getWeatherIcon(
              daily.weather_code[index]
            ),
        })
      );

      setWeather({
        city: location.name,

        country:
          location.country || "",

        temperature:
          current.temperature_2m,

        feelsLike:
          current.apparent_temperature,

        humidity:
          current.relative_humidity_2m,

        wind:
          current.wind_speed_10m,

        condition:
          getWeatherCondition(
            current.weather_code
          ),

        icon:
          getWeatherIcon(
            current.weather_code
          ),

        season:
          getSeason(),

        outfit:
          getOutfitRecommendation(
            current.temperature_2m,
            current.weather_code
          ),

        forecast,
      });

      setCity(location.name);

    } catch (err) {
      console.error(err);

      setWeather(null);

      setError(
        err.message ||
          "Unable to load weather."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     INITIAL WEATHER
  ===================================================== */

  useEffect(() => {
    loadWeather("Kabul");
  }, []);

  /* =====================================================
     SEARCH
  ===================================================== */

  const handleSearch = (event) => {
    event.preventDefault();

    if (!searchCity.trim()) {
      setError(
        "Please enter a city name."
      );

      return;
    }

    loadWeather(searchCity);

    setSearchCity("");
  };

  /* =====================================================
     REFRESH
  ===================================================== */

  const handleRefresh = () => {
    loadWeather(city);
  };

  /* =====================================================
     MY LOCATION
  ===================================================== */

  const handleMyLocation = () => {
    if (!navigator.geolocation) {
      setError(
        "Location is not supported by your browser."
      );

      return;
    }

    setLocationLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const {
            latitude,
            longitude,
          } = position.coords;

          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=celsius&wind_speed_unit=kmh&forecast_days=7&timezone=auto`
          );

          if (!response.ok) {
            throw new Error(
              "Unable to load your weather."
            );
          }

          const data =
            await response.json();

          const current =
            data.current;

          const daily =
            data.daily;

          const forecast =
            daily.time.map(
              (date, index) => ({
                date,

                day:
                  getDayName(
                    date,
                    index
                  ),

                high:
                  daily
                    .temperature_2m_max[
                    index
                  ],

                low:
                  daily
                    .temperature_2m_min[
                    index
                  ],

                condition:
                  getWeatherCondition(
                    daily
                      .weather_code[
                      index
                    ]
                  ),

                icon:
                  getWeatherIcon(
                    daily
                      .weather_code[
                      index
                    ]
                  ),
              })
            );

          setWeather({
            city: "My Location",

            country: "",

            temperature:
              current.temperature_2m,

            feelsLike:
              current.apparent_temperature,

            humidity:
              current.relative_humidity_2m,

            wind:
              current.wind_speed_10m,

            condition:
              getWeatherCondition(
                current.weather_code
              ),

            icon:
              getWeatherIcon(
                current.weather_code
              ),

            season:
              getSeason(),

            outfit:
              getOutfitRecommendation(
                current.temperature_2m,
                current.weather_code
              ),

            forecast,
          });

          setCity("My Location");

        } catch (err) {
          setError(
            err.message ||
              "Unable to load your weather."
          );
        } finally {
          setLocationLoading(false);
        }
      },

      () => {
        setError(
          "Please allow location permission."
        );

        setLocationLoading(false);
      }
    );
  };

  /* =====================================================
     TEMPERATURE
  ===================================================== */

  const convertTemperature = (
    value
  ) => {
    if (
      temperatureUnit === "F"
    ) {
      return Math.round(
        (value * 9) / 5 + 32
      );
    }

    return Math.round(value);
  };

  const getTemperatureSymbol =
    () => {
      return temperatureUnit === "C"
        ? "°C"
        : "°F";
    };

  /* =====================================================
     WEATHER ICON
  ===================================================== */

  const WeatherIcon = ({
    type,
    size = 48,
  }) => {
    if (type === "sunny") {
      return <Sun size={size} />;
    }

    if (type === "rain") {
      return (
        <CloudRain size={size} />
      );
    }

    if (type === "snow") {
      return (
        <CloudSnow size={size} />
      );
    }

    if (type === "cloudy") {
      return (
        <Cloud size={size} />
      );
    }

    return (
      <CloudSun size={size} />
    );
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <main className="weather-page">

      {/* =================================================
         HEADER
      ================================================= */}

      <section className="weather-header">

        <div className="weather-title">

          <span className="weather-label">
            SMARTCLOSET
          </span>

          <h1>
            Weather
          </h1>

          <p>
            Check today's weather and plan
            the perfect outfit for the day.
          </p>

        </div>

        <div className="weather-actions">

          <button
            type="button"
            className="weather-location-btn"
            onClick={handleMyLocation}
            disabled={
              locationLoading
            }
          >
            <MapPin size={17} />

            {locationLoading
              ? "Locating..."
              : "My Location"}
          </button>

          <button
            type="button"
            className="weather-refresh-btn"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw
              size={17}
              className={
                loading
                  ? "spinning"
                  : ""
              }
            />

            Refresh
          </button>

        </div>

      </section>


      {/* =================================================
         SEARCH
      ================================================= */}

      <section className="weather-search-section">

        <form
          className="weather-search"
          onSubmit={handleSearch}
        >

          <Search size={18} />

          <input
            type="text"
            value={searchCity}
            onChange={(event) =>
              setSearchCity(
                event.target.value
              )
            }
            placeholder="Search city..."
          />

          <button
            type="submit"
            disabled={loading}
          >
            Search
          </button>

        </form>

      </section>


      {/* =================================================
         TEMPERATURE UNIT
      ================================================= */}

      <div className="weather-options">

        <span>
          Temperature
        </span>

        <button
          type="button"
          className={
            temperatureUnit === "C"
              ? "active"
              : ""
          }
          onClick={() =>
            setTemperatureUnit("C")
          }
        >
          °C
        </button>

        <button
          type="button"
          className={
            temperatureUnit === "F"
              ? "active"
              : ""
          }
          onClick={() =>
            setTemperatureUnit("F")
          }
        >
          °F
        </button>

      </div>


      {/* =================================================
         ERROR
      ================================================= */}

      {error && (

        <div className="weather-error">

          <span>⚠</span>

          <p>
            {error}
          </p>

        </div>

      )}


      {/* =================================================
         LOADING
      ================================================= */}

      {loading && !weather && (

        <div className="weather-loading">

          <RefreshCw
            size={26}
            className="spinning"
          />

          <p>
            Loading weather...
          </p>

        </div>

      )}


      {/* =================================================
         WEATHER CONTENT
      ================================================= */}

      {weather && (

        <>

          {/* =============================================
             CURRENT WEATHER
          ============================================= */}

          <section className="current-weather">

            <div className="weather-location">

              <MapPin size={18} />

              <div>

                <h2>
                  {weather.city}
                </h2>

                {weather.country && (
                  <span>
                    {weather.country}
                  </span>
                )}

              </div>

            </div>


            <div className="current-weather-card">

              <div className="weather-main">

                <div className="weather-icon">

                  <WeatherIcon
                    type={weather.icon}
                    size={72}
                  />

                </div>

                <div className="temperature">

                  <strong>
                    {convertTemperature(
                      weather.temperature
                    )}
                  </strong>

                  <span>
                    {getTemperatureSymbol()}
                  </span>

                </div>

              </div>


              <div className="weather-condition">

                <h3>
                  {weather.condition}
                </h3>

                <p>
                  Feels like{" "}
                  {convertTemperature(
                    weather.feelsLike
                  )}
                  °
                </p>

              </div>


              <div className="weather-details">

                <div className="weather-detail">

                  <Droplets
                    size={18}
                  />

                  <div>

                    <span>
                      Humidity
                    </span>

                    <strong>
                      {weather.humidity}%
                    </strong>

                  </div>

                </div>


                <div className="weather-detail">

                  <Wind
                    size={18}
                  />

                  <div>

                    <span>
                      Wind
                    </span>

                    <strong>
                      {weather.wind} km/h
                    </strong>

                  </div>

                </div>

              </div>

            </div>

          </section>


          {/* =============================================
             SEASON + OUTFIT
          ============================================= */}

          <section className="weather-outfit-section">

            <div className="weather-outfit-icon">

              <Shirt size={25} />

            </div>

            <div className="weather-outfit-content">

              <span>
                SMARTCLOSET OUTFIT GUIDE
              </span>

              <h2>
                What should you wear?
              </h2>

              <p>
                It is currently{" "}
                <strong>
                  {weather.season}
                </strong>
                .
                Based on the current
                temperature and weather
                conditions, we recommend:
              </p>

              <strong className="outfit-recommendation">
                {weather.outfit}
              </strong>

            </div>

          </section>


          {/* =============================================
             FORECAST
          ============================================= */}

          <section className="forecast-section">

            <div className="section-heading">

              <div>

                <span>
                  7-DAY FORECAST
                </span>

                <h2>
                  Weather Forecast
                </h2>

              </div>

              <p>
                Check the temperature and
                conditions for the coming days.
              </p>

            </div>


            <div className="forecast-grid">

              {weather.forecast.map(
                (day) => (

                  <article
                    className={`forecast-card ${
                      day.day === "Today"
                        ? "today"
                        : ""
                    }`}
                    key={day.date}
                  >

                    <div className="forecast-top">

                      <strong>
                        {day.day}
                      </strong>

                      <span>
                        {formatDate(
                          day.date
                        )}
                      </span>

                    </div>


                    <div className="forecast-icon">

                      <WeatherIcon
                        type={day.icon}
                        size={38}
                      />

                    </div>


                    <span className="forecast-condition">

                      {day.condition}

                    </span>


                    <div className="forecast-temperatures">

                      <strong>
                        {convertTemperature(
                          day.high
                        )}
                        °
                      </strong>

                      <span>
                        {convertTemperature(
                          day.low
                        )}
                        °
                      </span>

                    </div>

                  </article>

                )
              )}

            </div>

          </section>


          {/* =============================================
             FOOTER
          ============================================= */}

          <div className="weather-footer-info">

            <span>
              {weather.city}
            </span>

            <span>
              •
            </span>

            <span>
              Live weather
            </span>

          </div>

        </>

      )}

    </main>
  );
}


/* =========================================================
   WEATHER CONDITION
========================================================= */

function getWeatherCondition(
  code
) {
  if (code === 0) {
    return "Clear";
  }

  if (
    code === 1 ||
    code === 2
  ) {
    return "Partly Cloudy";
  }

  if (code === 3) {
    return "Cloudy";
  }

  if (
    code === 45 ||
    code === 48
  ) {
    return "Foggy";
  }

  if (
    code >= 51 &&
    code <= 57
  ) {
    return "Drizzle";
  }

  if (
    code >= 61 &&
    code <= 67
  ) {
    return "Rain";
  }

  if (
    code >= 71 &&
    code <= 77
  ) {
    return "Snow";
  }

  if (
    code >= 80 &&
    code <= 82
  ) {
    return "Rain Showers";
  }

  if (
    code >= 85 &&
    code <= 86
  ) {
    return "Snow Showers";
  }

  if (code === 95) {
    return "Thunderstorm";
  }

  if (
    code === 96 ||
    code === 99
  ) {
    return "Storm";
  }

  return "Unknown";
}


/* =========================================================
   WEATHER ICON TYPE
========================================================= */

function getWeatherIcon(
  code
) {
  if (code === 0) {
    return "sunny";
  }

  if (
    code === 1 ||
    code === 2
  ) {
    return "partly-cloudy";
  }

  if (
    code === 3 ||
    code === 45 ||
    code === 48
  ) {
    return "cloudy";
  }

  if (
    (code >= 51 &&
      code <= 67) ||
    (code >= 80 &&
      code <= 82) ||
    code >= 95
  ) {
    return "rain";
  }

  if (
    (code >= 71 &&
      code <= 77) ||
    (code >= 85 &&
      code <= 86)
  ) {
    return "snow";
  }

  return "partly-cloudy";
}


/* =========================================================
   DAY NAME
========================================================= */

function getDayName(
  dateString,
  index
) {
  if (index === 0) {
    return "Today";
  }

  const date = new Date(
    `${dateString}T12:00:00`
  );

  return date.toLocaleDateString(
    "en-US",
    {
      weekday: "short",
    }
  );
}


/* =========================================================
   DATE FORMAT
========================================================= */

function formatDate(
  dateString
) {
  if (!dateString) {
    return "--";
  }

  const date = new Date(
    `${dateString}T12:00:00`
  );

  return date.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
    }
  );
}


/* =========================================================
   SEASON
========================================================= */

function getSeason() {
  const month =
    new Date().getMonth() + 1;

  if (
    month >= 3 &&
    month <= 5
  ) {
    return "Spring";
  }

  if (
    month >= 6 &&
    month <= 8
  ) {
    return "Summer";
  }

  if (
    month >= 9 &&
    month <= 11
  ) {
    return "Autumn";
  }

  return "Winter";
}


/* =========================================================
   OUTFIT RECOMMENDATION
========================================================= */

function getOutfitRecommendation(
  temperature,
  weatherCode
) {
  /* Snow */
  if (
    (weatherCode >= 71 &&
      weatherCode <= 77) ||
    (weatherCode >= 85 &&
      weatherCode <= 86)
  ) {
    return "Choose a warm coat, sweater, long pants, boots, and winter accessories.";
  }

  /* Rain */
  if (
    (weatherCode >= 51 &&
      weatherCode <= 67) ||
    (weatherCode >= 80 &&
      weatherCode <= 82) ||
    weatherCode >= 95
  ) {
    return "Choose a light waterproof jacket, long pants, and comfortable closed shoes.";
  }

  /* Very cold */
  if (temperature < 5) {
    return "Choose a heavy coat, warm sweater, long pants, boots, and a scarf.";
  }

  /* Cold */
  if (temperature < 15) {
    return "Choose a sweater or jacket with long pants and closed shoes.";
  }

  /* Mild */
  if (temperature < 22) {
    return "Choose a light jacket, cardigan, or long-sleeve top with comfortable pants.";
  }

  /* Warm */
  if (temperature < 30) {
    return "Choose a comfortable T-shirt or light top with jeans, trousers, or a skirt.";
  }

  /* Hot */
  return "Choose lightweight and breathable clothes such as a T-shirt, loose pants, shorts, or a light dress.";
}


export default Weather;