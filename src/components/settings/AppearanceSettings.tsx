import React from 'react';
import { useSettings } from '../../hooks/useSettings';
import styles from './Settings.module.css';

const PRESET_WALLPAPERS = [
  { name: 'Mountain Sunset', url: './backgrounds/bg_unsplash.jpg' },
  { name: 'Cosmic Nebula', url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200' },
  { name: 'Mist Forest', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200' },
  { name: 'Tokyo Night', url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200' },
  { name: 'Ocean Dusk', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200' },
];

const PRESET_GRADIENTS = [
  { name: 'Midnight Purple', css: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' },
  { name: 'Ocean Deep', css: 'linear-gradient(135deg, #0b132b, #1c2541, #3a506b)' },
  { name: 'Northern Lights', css: 'linear-gradient(135deg, #051923, #003554, #006494)' },
  { name: 'Crimson Night', css: 'linear-gradient(135deg, #1f0000, #400000, #1a0000)' },
];

const ACCENT_COLORS = [
  { name: 'Indigo', hex: '#6366f1' },
  { name: 'Cyan', hex: '#06b6d4' },
  { name: 'Pink', hex: '#ec4899' },
  { name: 'Orange', hex: '#f97316' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'White', hex: '#ffffff' },
];

export default function AppearanceSettings() {
  const { settings, updateSettings } = useSettings();
  const { appearance } = settings;

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Appearance & Customization</h2>

      {/* Background Mode */}
      <div className={styles.settingBlock}>
        <div className={styles.settingLabel}>Background Type</div>
        <div className={styles.segmentedToggle}>
          <button
            className={`${styles.segmentBtn} ${appearance.backgroundType === 'image' ? styles.activeSegment : ''}`}
            onClick={() => updateSettings({ appearance: { ...appearance, backgroundType: 'image' } })}
          >
            Wallpaper Image
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
      </div>

      {/* Preset Wallpapers Gallery */}
      {appearance.backgroundType === 'image' && (
        <div className={styles.settingBlock}>
          <div className={styles.settingLabel}>Curated HD Wallpapers</div>
          <div className={styles.wallpaperGallery}>
            {PRESET_WALLPAPERS.map((wp) => {
              const isSelected = appearance.backgroundImage === wp.url;
              return (
                <div
                  key={wp.name}
                  className={`${styles.wallpaperCard} ${isSelected ? styles.selectedWallpaper : ''}`}
                  style={{ backgroundImage: `url(${wp.url})` }}
                  onClick={() => updateSettings({ appearance: { ...appearance, backgroundImage: wp.url } })}
                >
                  <span className={styles.wallpaperTitle}>{wp.name}</span>
                  {isSelected && <span className={styles.wallpaperCheck}>✓</span>}
                </div>
              );
            })}
          </div>

          <div className={styles.customUrlRow}>
            <button
              className={styles.btnSecondary}
              onClick={() => {
                const url = prompt('Enter Custom Image URL:', appearance.backgroundImage || '');
                if (url !== null && url.trim()) {
                  updateSettings({ appearance: { ...appearance, backgroundImage: url.trim() } });
                }
              }}
            >
              🌐 Enter Custom Image URL
            </button>
          </div>
        </div>
      )}

      {/* Preset Gradients */}
      {appearance.backgroundType === 'gradient' && (
        <div className={styles.settingBlock}>
          <div className={styles.settingLabel}>Curated Gradients</div>
          <div className={styles.gradientGallery}>
            {PRESET_GRADIENTS.map((grad) => {
              const isSelected = appearance.background === grad.css;
              return (
                <div
                  key={grad.name}
                  className={`${styles.gradientCard} ${isSelected ? styles.selectedGradient : ''}`}
                  style={{ background: grad.css }}
                  onClick={() => updateSettings({ appearance: { ...appearance, background: grad.css } })}
                >
                  <span>{grad.name}</span>
                  {isSelected && <span>✓</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Accent Highlight Color Palette */}
      <div className={styles.settingBlock}>
        <div className={styles.settingLabel}>Accent Focus Color</div>
        <div className={styles.accentPalette}>
          {ACCENT_COLORS.map((color) => {
            const isSelected = (appearance.accentColor || '#6366f1') === color.hex;
            return (
              <div
                key={color.name}
                className={`${styles.accentSwatch} ${isSelected ? styles.selectedSwatch : ''}`}
                style={{ background: color.hex }}
                onClick={() => updateSettings({ appearance: { ...appearance, accentColor: color.hex } })}
                title={color.name}
              >
                {isSelected && <span className={styles.swatchCheck}>✓</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Corner Border Radius Slider */}
      <div className={styles.settingBlock}>
        <div className={styles.sliderRow}>
          <span className={styles.settingLabel}>Card Corner Radius</span>
          <span className={styles.sliderValue}>{appearance.borderRadius || 22}px</span>
        </div>
        <input
          type="range"
          min="8"
          max="36"
          step="2"
          className={styles.slider}
          value={appearance.borderRadius || 22}
          onChange={(e) =>
            updateSettings({ appearance: { ...appearance, borderRadius: parseInt(e.target.value, 10) } })
          }
        />
      </div>

      {/* Overlay Opacity Slider */}
      <div className={styles.settingBlock}>
        <div className={styles.sliderRow}>
          <span className={styles.settingLabel}>Dark Vignette Opacity</span>
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
          <span className={styles.settingLabel}>Background Blur</span>
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
    </div>
  );
}
