import React from 'react';
import AppearanceSettings from './AppearanceSettings';
import ClockSettings from './ClockSettings';
import LauncherSettings from './LauncherSettings';
import DataSettings from './DataSettings';
import styles from './Settings.module.css';

export default function SettingsPanel() {
  return (
    <div className={styles.container}>
      <AppearanceSettings />
      <ClockSettings />
      <LauncherSettings />
      <DataSettings />
      
      <div className={styles.version}>
        TV Launcher v1.0.0
      </div>
    </div>
  );
}
