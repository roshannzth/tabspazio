import React from 'react';
import { useWeather } from '../../hooks/useWeather';
import { useSettings } from '../../hooks/useSettings';
import styles from './WeatherWidget.module.css';

export const WeatherWidget: React.FC = () => {
  const { settings } = useSettings();
  const weatherSettings = settings.weather;

  if (!weatherSettings?.enabled) return null;

  const weather = useWeather();

  if (weather.loading) {
    return (
      <div className={styles.weatherContainer}>
        <span className={styles.weatherIcon}>🌤️</span>
        <span className={styles.cityText}>Loading...</span>
      </div>
    );
  }

  if (weather.error) {
    return null;
  }

  return (
    <div className={styles.weatherContainer} title={`${weather.city} — ${weather.condition}`}>
      <span className={styles.weatherIcon}>{weather.icon}</span>
      <span className={styles.tempText}>
        {weather.temp}
        {weather.unit}
      </span>
      <span className={styles.cityText}>{weather.city}</span>
    </div>
  );
};
