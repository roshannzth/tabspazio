import React from 'react';
import { useSettings } from '../../hooks/useSettings';
import styles from './Settings.module.css';

export default function AppearanceSettings() {
  const { settings, updateSettings } = useSettings();
  const { appearance } = settings;

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Appearance</h2>

      {/* Background Segmented Buttons */}
      <div className={styles.settingBlock}>
        <div className={styles.settingLabel}>Background</div>
        <div className={styles.segmentedToggle}>
          <button
            className={`${styles.segmentBtn} ${appearance.backgroundType === 'image' ? styles.activeSegment : ''}`}
            onClick={() => updateSettings({ appearance: { ...appearance, backgroundType: 'image' } })}
          >
            Image
          </button>
          <button
            className={`${styles.segmentBtn} ${appearance.backgroundType === 'gradient' ? styles.activeSegment : ''}`}
            onClick={() => updateSettings({ appearance: { ...appearance, backgroundType: 'gradient' } })}
          >
            Gradient
          </button>
          <button
            className={`${styles.segmentBtn} ${appearance.backgroundType === 'solid' ? styles.activeSegment : ''}`}
            onClick={() => updateSettings({ appearance: { ...appearance, backgroundType: 'solid' } })}
          >
            Solid Color
          </button>
        </div>

        {appearance.backgroundType === 'image' && (
          <div className={styles.imagePreviewRow}>
            <div
              className={styles.imageThumbnail}
              style={{
                backgroundImage: `url(${appearance.backgroundImage || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=400'})`,
              }}
            />
            <button
              className={styles.btnSecondary}
              onClick={() => {
                const url = prompt('Enter Image URL:', appearance.backgroundImage || '');
                if (url !== null) {
                  updateSettings({ appearance: { ...appearance, backgroundImage: url } });
                }
              }}
            >
              Change Image
            </button>
          </div>
        )}
      </div>

      {/* Overlay Opacity Slider */}
      <div className={styles.settingBlock}>
        <div className={styles.sliderRow}>
          <span className={styles.settingLabel}>Overlay Opacity</span>
          <span className={styles.sliderValue}>{Math.round(appearance.backgroundOpacity * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          className={styles.slider}
          value={appearance.backgroundOpacity}
          onChange={(e) =>
            updateSettings({ appearance: { ...appearance, backgroundOpacity: parseFloat(e.target.value) } })
          }
        />
      </div>

      {/* Blur Slider */}
      <div className={styles.settingBlock}>
        <div className={styles.sliderRow}>
          <span className={styles.settingLabel}>Blur</span>
          <span className={styles.sliderValue}>{appearance.backgroundBlur}px</span>
        </div>
        <input
          type="range"
          min="0"
          max="40"
          step="1"
          className={styles.slider}
          value={appearance.backgroundBlur}
          onChange={(e) =>
            updateSettings({ appearance: { ...appearance, backgroundBlur: parseInt(e.target.value, 10) } })
          }
        />
      </div>

      {/* Theme Selector (Dark vs Darker) */}
      <div className={styles.settingBlock}>
        <div className={styles.settingLabel}>Theme</div>
        <div className={styles.segmentedToggle}>
          <button
            className={`${styles.segmentBtn} ${appearance.theme === 'dark' ? styles.activeSegment : ''}`}
            onClick={() => updateSettings({ appearance: { ...appearance, theme: 'dark' } })}
          >
            Dark
          </button>
          <button
            className={`${styles.segmentBtn} ${appearance.theme === 'amoled' || appearance.theme === 'darker' ? styles.activeSegment : ''}`}
            onClick={() => updateSettings({ appearance: { ...appearance, theme: 'darker' } })}
          >
            Darker
          </button>
        </div>
      </div>
    </div>
  );
}
