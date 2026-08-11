import React from 'react';
import { useAppContext } from '../../context/AppContext';
import styles from './Settings.module.css';
import { AppearanceSettings as AppearanceSettingsType } from '../../models/Settings';

export default function AppearanceSettings() {
  const { settings, updateSettings } = useAppContext();
  const { appearance } = settings;

  const update = (updates: Partial<AppearanceSettingsType>) => {
    updateSettings({ appearance: { ...appearance, ...updates } });
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Appearance</h2>

      <div className={styles.row}>
        <div>
          <div className={styles.rowLabel}>Theme</div>
          <div className={styles.rowDesc}>Select the color scheme</div>
        </div>
        <select
          className={styles.settingsSelect}
          value={appearance.theme}
          onChange={(e) => update({ theme: e.target.value as any })}
        >
          <option value="dark">Dark</option>
          <option value="midnight">Midnight</option>
          <option value="amoled">AMOLED</option>
        </select>
      </div>

      <div className={styles.row}>
        <div>
          <div className={styles.rowLabel}>Background Type</div>
        </div>
        <select
          className={styles.settingsSelect}
          value={appearance.backgroundType}
          onChange={(e) => update({ backgroundType: e.target.value as any })}
        >
          <option value="solid">Solid Color</option>
          <option value="gradient">Gradient</option>
          <option value="image">Image</option>
        </select>
      </div>

      {appearance.backgroundType !== 'image' && (
        <div className={styles.row}>
          <div>
            <div className={styles.rowLabel}>Background Color / Gradient</div>
          </div>
          {appearance.backgroundType === 'solid' ? (
            <input
              type="color"
              className={styles.colorInput}
              value={appearance.background || '#000000'}
              onChange={(e) => update({ background: e.target.value })}
            />
          ) : (
            <input
              type="text"
              className={styles.settingsSelect}
              value={appearance.background || ''}
              onChange={(e) => update({ background: e.target.value })}
              placeholder="linear-gradient(...)"
            />
          )}
        </div>
      )}

      {appearance.backgroundType === 'image' && (
        <div className={styles.row}>
          <div>
            <div className={styles.rowLabel}>Background Image URL</div>
          </div>
          <input
            type="text"
            className={styles.settingsSelect}
            value={appearance.backgroundImage || ''}
            onChange={(e) => update({ backgroundImage: e.target.value })}
            placeholder="https://..."
          />
        </div>
      )}

      <div className={styles.row}>
        <div>
          <div className={styles.rowLabel}>Background Blur</div>
        </div>
        <input
          type="range"
          className={styles.range}
          min="0"
          max="20"
          value={appearance.backgroundBlur}
          onChange={(e) => update({ backgroundBlur: parseInt(e.target.value) })}
        />
      </div>

      <div className={styles.row}>
        <div>
          <div className={styles.rowLabel}>Background Opacity</div>
        </div>
        <input
          type="range"
          className={styles.range}
          min="0.1"
          max="1"
          step="0.1"
          value={appearance.backgroundOpacity}
          onChange={(e) => update({ backgroundOpacity: parseFloat(e.target.value) })}
        />
      </div>

      <div className={styles.row}>
        <div>
          <div className={styles.rowLabel}>Card Size</div>
        </div>
        <select
          className={styles.settingsSelect}
          value={appearance.cardSize}
          onChange={(e) => update({ cardSize: e.target.value as any })}
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>

      <div className={styles.row}>
        <div>
          <div className={styles.rowLabel}>Border Radius</div>
        </div>
        <input
          type="range"
          className={styles.range}
          min="0"
          max="32"
          value={appearance.borderRadius}
          onChange={(e) => update({ borderRadius: parseInt(e.target.value) })}
        />
      </div>
    </div>
  );
}
