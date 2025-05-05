"use client";

import { useState } from "react";
import styles from "../../styles/Search.module.css";
import { NextSeo } from "next-seo";

const API_KEY = "70db354af9884cbdbf3112201253103";

export default function Search() {
  const [searchInput, setSearchInput] = useState<string>("");
  const [weatherData, setWeatherData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    const filteredValue = value.replace(/[^a-zA-Z\s]/g, "");

    const formattedValue = filteredValue
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    setSearchInput(formattedValue);
  };

  const fetchWeather = async () => {
    if (!searchInput) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${searchInput}`
      );
      if (!response.ok) {
        throw new Error("I couldn't find that location. Please try again.");
      }

      const data = await response.json();
      setWeatherData(data);
      setError("");
    } catch (err) {
      setWeatherData(null);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        <h1 className={styles.title}>Search for Weather</h1>
        <input
          type="text"
          placeholder="Enter a city name..."
          className={styles.searchBar}
          value={searchInput}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
          data-testid="search-input"
        />
        <button
          onClick={fetchWeather}
          className={styles.button}
          data-testid="search-button"
        >
          Get Weather
        </button>

        {weatherData && (
          <NextSeo
            title={`Weather in ${weatherData.location.name} - Weather App`}
            description={`Current weather in ${weatherData.location.name}, ${weatherData.location.country}.`}
            canonical={`http://172.30.77.82:3001/search?city=${weatherData.location.name}`}
            openGraph={{
              title: `Weather in ${weatherData.location.name}`,
              description: `Current temperature, condition, humidity, and wind in ${weatherData.location.name}, ${weatherData.location.country}.`,
              url: `http://172.30.77.82:3001/search?city=${weatherData.location.name}`,
            }}
          />
        )}

        {error && (
          <p className={styles.error} data-testid="error-msg">
            {error}
          </p>
        )}
        {weatherData && (
          <div className={styles.result}>
            <div className={styles.headerRow}>
              <h2 className={styles.city}>
                {weatherData.location.name}, {weatherData.location.country}
              </h2>
              <div className={styles.iconColumn}>
                <img
                  src={weatherData.current.condition.icon}
                  alt="weather icon"
                  className={styles.iconSmall}
                />
                <p className={styles.dateText}>
                  {new Date(
                    weatherData.location.localtime
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className={styles.infoGrid}>
              <div className={`${styles.card} ${styles.temp}`}>
                <span className={styles.label}>Temperature</span>
                <span className={styles.value}>
                  {weatherData.current.temp_c}°C
                </span>
              </div>

              <div className={`${styles.card} ${styles.condition}`}>
                <span className={styles.label}>Condition</span>
                <span className={styles.value}>
                  {weatherData.current.condition.text}
                </span>
              </div>

              <div className={`${styles.card} ${styles.humidity}`}>
                <span className={styles.label}>Humidity</span>
                <span className={styles.value}>
                  {weatherData.current.humidity}%
                </span>
              </div>

              <div className={`${styles.card} ${styles.wind}`}>
                <span className={styles.label}>Wind</span>
                <span className={styles.value}>
                  {weatherData.current.wind_kph} kph
                </span>
              </div>
            </div>
          </div>
        )}
        {loading && <p data-testid="loading">Loading...</p>}
      </div>
    </div>
  );
}
