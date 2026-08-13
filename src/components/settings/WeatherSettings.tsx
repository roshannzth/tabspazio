import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { CustomSelect } from '../common/CustomSelect';
import styles from './Settings.module.css';
import { WeatherSettings as WeatherSettingsType } from '../../models/Settings';

interface GeoResult {
  id: number;
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}

export default function WeatherSettings() {
  const { settings, updateSettings } = useAppContext();
  const weather = settings.weather || {
    enabled: true,
    unit: 'celsius',
    city: 'New York',
    latitude: 40.7128,
    longitude: -74.006,
    refreshInterval: 15,
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeoResult[]>([]);
  const [searching, setSearching] = useState(false);

  const update = (updates: Partial<WeatherSettingsType>) => {
    updateSettings({ weather: { ...weather, ...updates } });
  };

  const unitOptions = [
    { label: 'Celsius (°C)', value: 'celsius' },
    { label: 'Fahrenheit (°F)', value: 'fahrenheit' },
  ];

  const intervalOptions = [
    { label: 'Every 15 Minutes (Default)', value: 15 },
    { label: 'Every 30 Minutes', value: 30 },
    { label: 'Every 45 Minutes', value: 45 },
    { label: 'Every 60 Minutes (1 Hour)', value: 60 },
  ];

  const handleSearchLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          searchQuery.trim()
        )}&count=5`
      );
      if (!res.ok) throw new Error('Geocoding search failed');
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (err) {
      console.error('Failed to search location', err);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const selectLocation = (result: GeoResult) => {
    update({
      city: result.name,
      latitude: result.latitude,
      longitude: result.longitude,
    });
    setSearchResults([]);
    setSearchQuery('');
  };

  const Toggle = ({ active, onClick }: { active: boolean; onClick: () => void }) => (
    <button className={`${styles.toggle} ${active ? styles.active : ''}`} onClick={onClick}>
      <div className={styles.toggleKnob} />
    </button>
  );

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Weather</h2>

      <div className={styles.row}>
        <div>
          <div className={styles.rowLabel}>Show Weather on Homescreen</div>
          <div className={styles.rowDesc}>Display current temperature & weather widget in the top header</div>
        </div>
        <Toggle active={weather.enabled} onClick={() => update({ enabled: !weather.enabled })} />
      </div>

      {weather.enabled && (
        <>
          <div className={styles.row}>
            <div>
              <div className={styles.rowLabel}>Temperature Unit</div>
            </div>
            <CustomSelect
              options={unitOptions}
              value={weather.unit}
              onChange={(val) => update({ unit: val as any })}
            />
          </div>

          <div className={styles.row}>
            <div>
              <div className={styles.rowLabel}>Auto-Refresh Frequency</div>
              <div className={styles.rowDesc}>How often weather updates in the background (15m min – 60m max)</div>
            </div>
            <CustomSelect
              options={intervalOptions}
              value={weather.refreshInterval || 15}
              onChange={(val) => update({ refreshInterval: Number(val) })}
            />
          </div>

          <div className={styles.settingBlock} style={{ marginTop: '28px' }}>
            <div className={styles.settingLabel}>Current Location</div>
            <div
              style={{
                fontSize: '1.05rem',
                fontWeight: 700,
                color: '#818cf8',
                background: 'rgba(99, 102, 241, 0.12)',
                padding: '12px 20px',
                borderRadius: '16px',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                display: 'inline-block',
                marginBottom: '20px',
                backdropFilter: 'blur(16px)',
              }}
            >
              📍 {weather.city} ({weather.latitude?.toFixed(2)}, {weather.longitude?.toFixed(2)})
            </div>

            <form onSubmit={handleSearchLocation} className={styles.weatherSearchForm}>
              <input
                type="text"
                className={styles.textInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city (e.g. Mumbai, London, Tokyo, New Delhi)"
                style={{ flex: 1 }}
              />
              <button
                type="submit"
                className={styles.weatherSearchBtn}
                disabled={searching}
              >
                <span>🔍</span> {searching ? 'Searching...' : 'Search City'}
              </button>
            </form>

            {searchResults.length > 0 && (
              <div className={styles.weatherResultsMenu}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.6)', padding: '4px 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Suggested Locations
                </div>
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => selectLocation(result)}
                    className={styles.weatherResultItem}
                  >
                    <span>
                      📍 <strong>{result.name}</strong> {result.admin1 ? `, ${result.admin1}` : ''}{' '}
                      <span style={{ opacity: 0.6, fontWeight: 400 }}>({result.country})</span>
                    </span>
                    <span style={{ color: '#818cf8', fontWeight: 700, fontSize: '0.88rem' }}>Set Location</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
