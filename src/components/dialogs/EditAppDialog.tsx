import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { App } from '../../models/App';
import { IconPicker } from '../common/IconPicker';
import styles from './Dialog.module.css';

interface EditAppDialogProps {
  app: App;
  onClose: () => void;
}

export function EditAppDialog({ app, onClose }: EditAppDialogProps) {
  const { updateApp } = useAppContext();
  const [name, setName] = useState(app.name);
  const [url, setUrl] = useState(app.url || '');
  const [icon, setIcon] = useState(app.icon || '');
  const [background, setBackground] = useState(app.background || '');
  const [error, setError] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    inputRef.current?.focus();
    
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (!url.trim()) {
      setError('URL is required');
      return;
    }

    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = `https://${finalUrl}`;
    }

    updateApp(app.id, {
      name: name.trim(),
      type: 'website',
      url: finalUrl,
      icon: icon || undefined,
      background: background || undefined,
    });
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-label="Edit App">
      <div className={styles.dialog} onClick={e => e.stopPropagation()}>
        <h2 className={styles.title}>Edit Application</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Application Name</label>
            <input ref={inputRef} className={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="App Name" />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Website URL</label>
            <input className={styles.input} value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com" />
          </div>

          <IconPicker value={icon} onChange={setIcon} appName={name} />

          <div className={styles.field}>
            <label className={styles.label}>Background Accent Color</label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input type="color" value={background || '#1a1a2e'} onChange={e => setBackground(e.target.value)} style={{ width: 44, height: 44, padding: 0, border: 'none', background: 'transparent', cursor: 'pointer' }} />
              <input className={styles.input} style={{ flex: 1 }} value={background} onChange={e => setBackground(e.target.value)} placeholder="#HEX or linear-gradient()" />
            </div>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.actions}>
            <button type="button" className={styles.btnSecondary} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.btnPrimary}>Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}
