import React, { useRef, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import styles from './Settings.module.css';
import { ConfirmDialog } from '../dialogs/ConfirmDialog';

export default function DataSettings() {
  const { exportConfig, importConfig } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleExport = async () => {
    try {
      await exportConfig();
    } catch (e) {
      console.error('Failed to export', e);
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    importConfig(file)
      .then(() => {
        setMessage({ text: 'Configuration imported successfully.', isError: false });
        setTimeout(() => window.location.reload(), 1500);
      })
      .catch((err) => {
        setMessage({ text: err.message || 'Failed to import configuration.', isError: true });
      });
  };

  const handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Data & Backup</h2>

      <div className={styles.row}>
        <div>
          <div className={styles.rowLabel}>Export / Import</div>
          <div className={styles.rowDesc}>Backup or restore your layout and settings</div>
          
          {message && (
            <div style={{ marginTop: '8px', color: message.isError ? '#ff4d4f' : '#52c41a', fontSize: '0.85rem' }}>
              {message.text}
            </div>
          )}

          <div className={styles.btnRow}>
            <button className={styles.btn} onClick={handleExport}>Export Configuration</button>
            <button className={styles.btn} onClick={() => fileInputRef.current?.click()}>Import Configuration</button>
            <input 
              type="file" 
              accept=".json" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleImport} 
            />
          </div>
        </div>
      </div>

      <div className={styles.row}>
        <div>
          <div className={styles.rowLabel}>Reset</div>
          <div className={styles.rowDesc}>Reset all settings and apps to default</div>
          
          <div className={styles.btnRow}>
            <button 
              className={styles.btn} 
              style={{ color: '#ff4d4f', borderColor: 'rgba(255, 77, 79, 0.3)' }} 
              onClick={() => setShowConfirm(true)}
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>

      {showConfirm && (
        <ConfirmDialog
          title="Reset to Defaults"
          message="Are you sure you want to reset all settings, apps, and pages to their defaults? This action cannot be undone."
          confirmLabel="Reset"
          cancelLabel="Cancel"
          isDanger={true}
          onConfirm={handleReset}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}
