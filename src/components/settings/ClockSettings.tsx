import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { CustomSelect } from '../common/CustomSelect';
import styles from './Settings.module.css';
import { ClockSettings as ClockSettingsType } from '../../models/Settings';

export default function ClockSettings() {
  const { settings, updateSettings } = useAppContext();
  const { clock } = settings;

  const update = (updates: Partial<ClockSettingsType>) => {
    updateSettings({ clock: { ...clock, ...updates } });
  };

  const formatOptions = [
    { label: '12-hour', value: '12h' },
    { label: '24-hour', value: '24h' },
  ];

  const Toggle = ({ active, onClick }: { active: boolean; onClick: () => void }) => (
    <button className={`${styles.toggle} ${active ? styles.active : ''}`} onClick={onClick}>
      <div className={styles.toggleKnob} />
    </button>
  );

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Clock & Hero Text</h2>

      <div className={styles.row}>
        <div>
          <div className={styles.rowLabel}>Time Format</div>
        </div>
        <CustomSelect
          options={formatOptions}
          value={clock.format}
          onChange={(val) => update({ format: val as any })}
        />
      </div>

      <div className={styles.row}>
        <div>
          <div className={styles.rowLabel}>Show Seconds</div>
        </div>
        <Toggle active={clock.showSeconds} onClick={() => update({ showSeconds: !clock.showSeconds })} />
      </div>

      <div className={styles.row}>
        <div>
          <div className={styles.rowLabel}>Show Date</div>
        </div>
        <Toggle active={clock.showDate} onClick={() => update({ showDate: !clock.showDate })} />
      </div>

      <div className={styles.row}>
        <div>
          <div className={styles.rowLabel}>Show Hero Greeting</div>
        </div>
        <Toggle active={clock.showGreeting} onClick={() => update({ showGreeting: !clock.showGreeting })} />
      </div>

      {clock.showGreeting && (
        <>
          <div className={styles.settingBlock} style={{ marginTop: '20px' }}>
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
            <div className={styles.settingLabel}>Greeting Subtitle</div>
            <input
              type="text"
              className={styles.textInput}
              value={clock.greetingSubtitle !== undefined ? clock.greetingSubtitle : 'What will you watch today?'}
              onChange={(e) => update({ greetingSubtitle: e.target.value })}
              placeholder="e.g. What will you watch today?"
            />
          </div>
        </>
      )}
    </div>
  );
}
