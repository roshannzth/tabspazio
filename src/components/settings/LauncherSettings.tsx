import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { CustomSelect } from '../common/CustomSelect';
import styles from './Settings.module.css';
import { LauncherSettings as LauncherSettingsType } from '../../models/Settings';

export default function LauncherSettings() {
  const { settings, updateSettings } = useAppContext();
  const { launcher } = settings;

  const update = (updates: Partial<LauncherSettingsType>) => {
    updateSettings({ launcher: { ...launcher, ...updates } });
  };

  const columnOptions = [
    { label: '4 Columns', value: 4 },
    { label: '5 Columns', value: 5 },
    { label: '6 Columns', value: 6 },
    { label: '7 Columns', value: 7 },
    { label: '8 Columns', value: 8 },
  ];

  const Toggle = ({ active, onClick }: { active: boolean; onClick: () => void }) => (
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
        <CustomSelect
          options={columnOptions}
          value={launcher.columns}
          onChange={(val) => update({ columns: Number(val) })}
        />
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
