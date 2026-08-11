import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import styles from './Dialog.module.css';

interface AddPageDialogProps {
  onClose: () => void;
}

export function AddPageDialog({ onClose }: AddPageDialogProps) {
  const { addPage, addApp } = useAppContext();
  const [name, setName] = useState('');
  const [background, setBackground] = useState('');
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
      setError('Page Name is required');
      return;
    }

    const pageId = crypto.randomUUID();
    
    addPage({
      id: pageId,
      name: name.trim(),
      background: background || undefined,
      apps: [],
    });

    addApp({
      name: name.trim(),
      type: 'page',
      pageId: pageId,
      background: background || undefined,
    });

    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-label="Add Page">
      <div className={styles.dialog} onClick={e => e.stopPropagation()}>
        <h2 className={styles.title}>Add Custom Page</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Page Name</label>
            <input ref={inputRef} className={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="Games, Work, etc." />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Background Color (Optional)</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input type="color" value={background || '#1a1a2e'} onChange={e => setBackground(e.target.value)} style={{ width: 40, height: 40, padding: 0, border: 'none', background: 'transparent' }} />
              <input className={styles.input} style={{ flex: 1 }} value={background} onChange={e => setBackground(e.target.value)} placeholder="#HEX or rgb()" />
            </div>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.actions}>
            <button type="button" className={styles.btnSecondary} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.btnPrimary}>Add Page</button>
          </div>
        </form>
      </div>
    </div>
  );
}
