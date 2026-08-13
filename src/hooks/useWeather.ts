import { useState, useEffect } from 'react';
import { useSettings } from './useSettings';

export interface WeatherData {
  temp: number;
  unit: string;
  icon: string;
  condition: string;
  city: string;
  loading: boolean;
  error: boolean;
}

export function getWeatherInfo(code: number): { icon: string; condition: string } {
  if (code === 0) return { icon: '☀️', condition: 'Clear Sky' };
  if (code >= 1 && code <= 3) return { icon: '⛅', condition: 'Partly Cloudy' };
  if (code === 45 || code === 48) return { icon: '🌫️', condition: 'Foggy' };
  if (code >= 51 && code <= 67) return { icon: '🌧️', condition: 'Rain' };
  if (code >= 71 && code <= 77) return { icon: '❄️', condition: 'Snow' };
  if (code >= 80 && code <= 82) return { icon: '🌧️', condition: 'Showers' };
  if (code >= 95 && code <= 99) return { icon: '🌩️', condition: 'Thunderstorm' };
  return { icon: '🌤️', condition: 'Fair' };
}

export function useWeather(): WeatherData {
  const { settings } = useSettings();
  const weatherSettings = settings.weather || {
    enabled: true,
    unit: 'celsius',
    city: 'New York',
    latitude: 40.7128,
    longitude: -74.006,
    refreshInterval: 15,
  };

  const [weather, setWeather] = useState<WeatherData>({
    temp: 0,
    unit: weatherSettings.unit === 'fahrenheit' ? '°F' : '°C',
    icon: '☀️',
    condition: 'Loading...',
    city: weatherSettings.city || 'New York',
    loading: true,
    error: false,
  });

  useEffect(() => {
    if (!weatherSettings.enabled) return;

    let isMounted = true;

    const fetchWeather = async () => {
      try {
        const lat = weatherSettings.latitude ?? 40.7128;
        const lon = weatherSettings.longitude ?? -74.006;
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        if (!res.ok) throw new Error('Weather fetch failed');
        const data = await res.json();
        const current = data.current_weather;
        if (!current) throw new Error('No weather data');

        let rawTemp = current.temperature;
        let displayTemp = Math.round(rawTemp);
        let unitSymbol = '°C';

        if (weatherSettings.unit === 'fahrenheit') {
          displayTemp = Math.round((rawTemp * 9) / 5 + 32);
          unitSymbol = '°F';
        }

        const info = getWeatherInfo(current.weathercode);

        if (isMounted) {
          setWeather({
            temp: displayTemp,
            unit: unitSymbol,
            icon: info.icon,
            condition: info.condition,
            city: weatherSettings.city || 'New York',
            loading: false,
            error: false,
          });
        }
      } catch (e) {
        if (isMounted) {
          setWeather((prev) => ({
            ...prev,
            loading: false,
            error: true,
            condition: 'Unavailable',
          }));
        }
      }
    };

    fetchWeather();
    const intervalMins = Math.max(15, Math.min(60, weatherSettings.refreshInterval || 15));
    const interval = setInterval(fetchWeather, intervalMins * 60 * 1000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [
    weatherSettings.enabled,
    weatherSettings.unit,
    weatherSettings.city,
    weatherSettings.latitude,
    weatherSettings.longitude,
    weatherSettings.refreshInterval,
  ]);

  return weather;
}
