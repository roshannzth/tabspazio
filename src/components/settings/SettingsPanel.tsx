import React, { useState } from 'react';
import AppearanceSettings from './AppearanceSettings';
import ClockSettings from './ClockSettings';
import GreetingSettings from './GreetingSettings';
import WeatherSettings from './WeatherSettings';
import DataSettings from './DataSettings';
import styles from './Settings.module.css';

type SettingsTab = 'appearance' | 'clock' | 'greeting' | 'weather' | 'backup' | 'about';

export default function SettingsPanel() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('appearance');

  return (
    <div className={styles.settingsLayout}>
      {/* Left Navigation Sidebar */}
      <aside className={styles.settingsSidebar}>
        <button
          className={`${styles.sidebarItem} ${activeTab === 'appearance' ? styles.activeSidebarItem : ''}`}
          onClick={() => setActiveTab('appearance')}
        >
          <span className={styles.itemIcon}>🎨</span> Appearance
        </button>

        <button
          className={`${styles.sidebarItem} ${activeTab === 'clock' ? styles.activeSidebarItem : ''}`}
          onClick={() => setActiveTab('clock')}
        >
          <span className={styles.itemIcon}>⏰</span> Clock
        </button>

        <button
          className={`${styles.sidebarItem} ${activeTab === 'greeting' ? styles.activeSidebarItem : ''}`}
          onClick={() => setActiveTab('greeting')}
        >
          <span className={styles.itemIcon}>💬</span> Greeting
        </button>

        <button
          className={`${styles.sidebarItem} ${activeTab === 'weather' ? styles.activeSidebarItem : ''}`}
          onClick={() => setActiveTab('weather')}
        >
          <span className={styles.itemIcon}>🌤️</span> Weather
        </button>

        <button
          className={`${styles.sidebarItem} ${activeTab === 'backup' ? styles.activeSidebarItem : ''}`}
          onClick={() => setActiveTab('backup')}
        >
          <span className={styles.itemIcon}>💾</span> Backup & Sync
        </button>

        <button
          className={`${styles.sidebarItem} ${activeTab === 'about' ? styles.activeSidebarItem : ''}`}
          onClick={() => setActiveTab('about')}
        >
          <span className={styles.itemIcon}>ℹ️</span> About
        </button>
      </aside>

      {/* Main Settings Content Area */}
      <main className={styles.settingsContent}>
        {activeTab === 'appearance' && <AppearanceSettings />}
        {activeTab === 'clock' && <ClockSettings />}
        {activeTab === 'greeting' && <GreetingSettings />}
        {activeTab === 'weather' && <WeatherSettings />}
        {activeTab === 'backup' && <DataSettings />}
        {activeTab === 'about' && (
          <div className={styles.aboutCard}>
            <h2 className={styles.aboutTitle}>TabSpazio</h2>
            <p className={styles.aboutVersion}>Version 1.0.0</p>
            <p className={styles.aboutDesc}>
              A customizable, cinematic Apple TV & Google TV style app launcher replacement for your browser's New Tab page.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
