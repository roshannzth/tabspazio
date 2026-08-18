import React from 'react';
import { useAppContext } from '../../context/AppContext';
import styles from './Settings.module.css';
import { ClockSettings as ClockSettingsType } from '../../models/Settings';

export default function GreetingSettings() {
  const { settings, updateSettings } = useAppContext();
  const { clock } = settings;

  const update = (updates: Partial<ClockSettingsType>) => {
    updateSettings({ clock: { ...clock, ...updates } });
  };

  const Toggle = ({ active, onClick }: { active: boolean; onClick: () => void }) => (
    <button className={`${styles.toggle} ${active ? styles.active : ''}`} onClick={onClick}>
      <div className={styles.toggleKnob} />
    </button>
  );

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Greeting</h2>

      <div className={styles.row}>
        <div>
          <div className={styles.rowLabel}>Show Greeting</div>
          <div className={styles.rowDesc}>Display the welcome text on top-left of homescreen</div>
        </div>
        <Toggle active={clock.showGreeting} onClick={() => update({ showGreeting: !clock.showGreeting })} />
      </div>

      {clock.showGreeting && (
        <>
          <div className={styles.settingBlock} style={{ marginTop: '24px' }}>
            <div className={styles.settingLabel}>Greeting Prefix</div>
            <input
              type="text"
              className={styles.textInput}
              value={clock.greetingPrefix !== undefined ? clock.greetingPrefix : 'Hello,'}
              onChange={(e) => update({ greetingPrefix: e.target.value })}
              placeholder="e.g. Hello, or Welcome,"
            />
          </div>

          <div className={styles.settingBlock}>
            <div className={styles.settingLabel}>Greeting Title (Leave empty for dynamic time-of-day)</div>
            <input
              type="text"
              className={styles.textInput}
              value={clock.greetingTitle || ''}
              onChange={(e) => update({ greetingTitle: e.target.value })}
              placeholder="e.g. Good Afternoon (or custom title)"
            />
          </div>

          <div className={styles.settingBlock}>
            <div className={styles.settingLabel}>Greeting Subtitle (Optional)</div>
            <input
              type="text"
              className={styles.textInput}
              value={clock.greetingSubtitle !== undefined ? clock.greetingSubtitle : ''}
              onChange={(e) => update({ greetingSubtitle: e.target.value })}
              placeholder="e.g. Add a custom subtitle message (optional)"
            />
          </div>
        </>
      )}
    </div>
  );
}
