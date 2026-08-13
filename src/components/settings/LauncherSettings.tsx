import React from 'react';
import { useAppContext } from '../../context/AppContext';
import styles from './Settings.module.css';
import { LauncherSettings as LauncherSettingsType } from '../../models/Settings';

export default function LauncherSettings() {
  const { settings, updateSettings } = useAppContext();
  const { launcher } = settings;

  const update = (updates: Partial<LauncherSettingsType>) => {
    updateSettings({ launcher: { ...launcher, ...updates } });
  };

  const Toggle = ({ active, onClick }: { active: boolean; onClick: () => void }) => (
    <button className={`${styles.toggle} ${active ? styles.active : ''}`} onClick={onClick}>
      <div className={styles.toggleKnob} />
    </button>
  );

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Launcher Behavior</h2>

      <div className={styles.row}>
        <div>
          <div className={styles.rowLabel}>Enable Animations</div>
          <div className={styles.rowDesc}>Smooth card focus and page transitions</div>
        </div>
        <Toggle active={launcher.animations} onClick={() => update({ animations: !launcher.animations })} />
      </div>
    </div>
  );
}
