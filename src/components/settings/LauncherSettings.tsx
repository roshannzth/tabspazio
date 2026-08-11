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

  const Toggle = ({ active, onClick }: { active: boolean, onClick: () => void }) => (
    <button className={`${styles.toggle} ${active ? styles.active : ''}`} onClick={onClick}>
      <div className={styles.toggleKnob} />
    </button>
  );

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Launcher</h2>

      <div className={styles.row}>
        <div>
          <div className={styles.rowLabel}>Columns</div>
          <div className={styles.rowDesc}>Number of apps per row</div>
        </div>
        <select
          className={styles.settingsSelect}
          value={launcher.columns}
          onChange={(e) => update({ columns: parseInt(e.target.value) })}
        >
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
        </select>
      </div>

      <div className={styles.row}>
        <div>
          <div className={styles.rowLabel}>Show Category Labels</div>
        </div>
        <Toggle active={launcher.showCategoryLabels} onClick={() => update({ showCategoryLabels: !launcher.showCategoryLabels })} />
      </div>

      <div className={styles.row}>
        <div>
          <div className={styles.rowLabel}>Enable Animations</div>
        </div>
        <Toggle active={launcher.animations} onClick={() => update({ animations: !launcher.animations })} />
      </div>
    </div>
  );
}
