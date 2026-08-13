import React, { useRef, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { ConfirmDeleteDialog } from '../dialogs/ConfirmDeleteDialog';
import styles from './Settings.module.css';

export default function DataSettings() {
  const { exportConfig, importConfig } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showResetConfirm, setShowResetConfirm] = useState(false);
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
        setTimeout(() => window.location.reload(), 1200);
      })
      .catch((err) => {
        setMessage({ text: err.message || 'Failed to import configuration.', isError: true });
      });
  };

  const handleResetAll = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Backup & Sync</h2>

      {message && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: '10px',
            background: message.isError ? 'rgba(239,68,68,0.15)' : 'rgba(52,168,83,0.15)',
            color: message.isError ? '#f87171' : '#34a853',
            fontSize: '0.85rem',
            marginBottom: '16px',
          }}
        >
          {message.text}
        </div>
      )}

      <div className={styles.backupGrid}>
        {/* Export Card */}
        <div className={styles.cardBox}>
          <div className={styles.cardHeader}>Export Configuration</div>
          <p className={styles.cardDesc}>Save your apps, pages and settings to a file.</p>
          <button className={styles.btnAction} onClick={handleExport}>
            <span>📥</span> Export to File
          </button>
        </div>

        {/* Import Card */}
        <div className={styles.cardBox}>
          <div className={styles.cardHeader}>Import Configuration</div>
          <p className={styles.cardDesc}>Import a previously exported configuration file.</p>
          <button className={styles.btnAction} onClick={() => fileInputRef.current?.click()}>
            <span>📤</span> Import from File
          </button>
          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleImport}
          />
        </div>

        {/* Reset All Data Card */}
        <div className={`${styles.cardBox} ${styles.dangerBox}`}>
          <div className={styles.cardHeader}>Reset All Data</div>
          <p className={styles.cardDesc}>This will permanently delete all your data.</p>
          <button className={styles.btnDanger} onClick={() => setShowResetConfirm(true)}>
            <span>🗑️</span> Reset All Data
          </button>
        </div>
      </div>

      {showResetConfirm && (
        <ConfirmDeleteDialog
          title="Reset All Data?"
          message="This will permanently delete all your custom apps, pages, categories, and settings. This action cannot be undone."
          onConfirm={handleResetAll}
          onCancel={() => setShowResetConfirm(false)}
        />
      )}
    </div>
  );
}
