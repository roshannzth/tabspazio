import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { IconPicker } from '../common/IconPicker';
import styles from './Dialog.module.css';

interface AddAppDialogProps {
  onClose: () => void;
  defaultCategoryId?: string;
}

export function AddAppDialog({ onClose, defaultCategoryId }: AddAppDialogProps) {
  const { addApp, categories, pages } = useAppContext();
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<'website' | 'page'>('website');
  const [pageId, setPageId] = useState('');
  const [categoryId, setCategoryId] = useState(defaultCategoryId || '');
  const [icon, setIcon] = useState('');
  const [background, setBackground] = useState('');
  const [error, setError] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    inputRef.current?.focus();
    
    // prevent body scrolling
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

    if (type === 'website' && !url.trim()) {
      setError('URL is required for websites');
      return;
    }
    
    if (type === 'website' && url.trim() && !url.startsWith('http://') && !url.startsWith('https://')) {
      setError('URL must start with http:// or https://');
      return;
    }

    if (type === 'page' && !pageId) {
      setError('Please select a page');
      return;
    }

    addApp({
      name: name.trim(),
      type,
      url: type === 'website' ? url.trim() : undefined,
      pageId: type === 'page' ? pageId : undefined,
      categoryId: categoryId || undefined,
      icon: icon || undefined,
      background: background || undefined,
    });
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-label="Add App">
      <div className={styles.dialog} onClick={e => e.stopPropagation()}>
        <h2 className={styles.title}>Add App</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Name</label>
            <input ref={inputRef} className={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="App Name" />
          </div>
          
          <div className={styles.field}>
            <label className={styles.label}>Type</label>
            <select className={styles.select} value={type} onChange={e => setType(e.target.value as 'website' | 'page')}>
              <option value="website">Website</option>
              <option value="page">Custom Page</option>
            </select>
          </div>

          {type === 'website' ? (
            <div className={styles.field}>
              <label className={styles.label}>URL</label>
              <input className={styles.input} value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com" />
            </div>
          ) : (
            <div className={styles.field}>
              <label className={styles.label}>Select Page</label>
              <select className={styles.select} value={pageId} onChange={e => setPageId(e.target.value)}>
                <option value="">-- Select a page --</option>
                {pages.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label}>Category</label>
            <select className={styles.select} value={categoryId} onChange={e => setCategoryId(e.target.value)}>
              <option value="">None (Uncategorized)</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <IconPicker value={icon} onChange={setIcon} appName={name} />

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
            <button type="submit" className={styles.btnPrimary}>Add App</button>
          </div>
        </form>
      </div>
    </div>
  );
}
