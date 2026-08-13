import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import styles from './AddAppSteppedDialog.module.css';

interface AddPageSteppedDialogProps {
  onClose: () => void;
}

export const AddPageSteppedDialog: React.FC<AddPageSteppedDialogProps> = ({ onClose }) => {
  const { addPage, addApp } = useAppContext();

  const [activeTab, setActiveTab] = useState<'general' | 'icon' | 'background' | 'preview'>('general');
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('✈️');
  const [background, setBackground] = useState('');
  const [error, setError] = useState('');

  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSave = () => {
    if (!name.trim()) {
      setError('Page Name is required');
      setActiveTab('general');
      return;
    }

    const pageId = crypto.randomUUID();

    addPage({
      id: pageId,
      name: name.trim(),
      icon: icon || undefined,
      background: background || undefined,
      apps: [],
    });

    addApp({
      name: name.trim(),
      type: 'page',
      pageId: pageId,
      icon: icon || undefined,
      background: background || '#0066ff',
    });

    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <aside className={styles.sidebar}>
          <button
            className={`${styles.sidebarTab} ${activeTab === 'general' ? styles.activeSidebarTab : ''}`}
            onClick={() => setActiveTab('general')}
          >
            <span className={styles.tabIcon}>⚙️</span> General
          </button>
          <button
            className={`${styles.sidebarTab} ${activeTab === 'icon' ? styles.activeSidebarTab : ''}`}
            onClick={() => setActiveTab('icon')}
          >
            <span className={styles.tabIcon}>🖼️</span> Icon
          </button>
          <button
            className={`${styles.sidebarTab} ${activeTab === 'background' ? styles.activeSidebarTab : ''}`}
            onClick={() => setActiveTab('background')}
          >
            <span className={styles.tabIcon}>🎨</span> Background
          </button>
          <button
            className={`${styles.sidebarTab} ${activeTab === 'preview' ? styles.activeSidebarTab : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            <span className={styles.tabIcon}>👁️</span> Preview
          </button>
        </aside>

        <main className={styles.mainPanel}>
          <h2 className={styles.title}>Create New Page</h2>

          {error && <div className={styles.errorMessage}>{error}</div>}

          {activeTab === 'general' && (
            <div className={styles.stepContent}>
              <div className={styles.field}>
                <label className={styles.label}>Page Name</label>
                <input
                  ref={nameRef}
                  className={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Travel, Work, Games..."
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Page Icon</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className={styles.previewIconCircle}>
                    <span style={{ fontSize: 24 }}>{icon}</span>
                  </div>
                  <button className={styles.refreshBtn} onClick={() => setActiveTab('icon')}>
                    Change
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'icon' && (
            <div className={styles.stepContent}>
              <label className={styles.label}>Choose Emoji / Icon</label>
              <div className={styles.iconLibraryGrid}>
                {['✈️', '🎬', '🍿', '💼', '🎮', '📚', '🎵', '⚽', '🚗', '🍔', '🎨', '🚀'].map((emoji) => (
                  <button
                    key={emoji}
                    className={styles.libraryEmojiBtn}
                    onClick={() => {
                      setIcon(emoji);
                      setActiveTab('general');
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'background' && (
            <div className={styles.stepContent}>
              <div className={styles.field}>
                <label className={styles.label}>Page Accent Color</label>
                <input
                  type="color"
                  value={background || '#0066ff'}
                  onChange={(e) => setBackground(e.target.value)}
                  style={{ width: 60, height: 40, border: 'none', background: 'transparent', cursor: 'pointer' }}
                />
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className={styles.stepContent} style={{ alignItems: 'center', justifyContent: 'center' }}>
              <div className={styles.previewCard} style={{ background: background || '#0066ff' }}>
                <span style={{ fontSize: 32 }}>{icon}</span>
              </div>
              <div className={styles.previewName}>{name || 'Page Name'}</div>
            </div>
          )}

          <div className={styles.actionsFooter}>
            <div style={{ flex: 1 }} />
            <button type="button" className={styles.btnCancel} onClick={onClose}>
              Cancel
            </button>
            <button type="button" className={styles.btnNext} onClick={handleSave}>
              Create Page
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};
