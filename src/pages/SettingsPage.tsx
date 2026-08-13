import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsPanel from '../components/settings/SettingsPanel';
import styles from '../components/settings/Settings.module.css';

export default function SettingsPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        navigate('/');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <div className={styles.settingsPageContainer}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backBtn} onClick={() => navigate('/')} title="Return to Homescreen">
            <span className={styles.backIcon}>←</span> Back
          </button>
          <h1 className={styles.pageTitle}>Settings</h1>
        </div>
      </header>

      <main className={styles.panelWrapper}>
        <SettingsPanel />
      </main>
    </div>
  );
}
