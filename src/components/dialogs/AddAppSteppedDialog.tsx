import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { getFaviconUrl } from '../../services/favicon';
import styles from './AddAppSteppedDialog.module.css';

interface AddAppSteppedDialogProps {
  onClose: () => void;
}

type TabType = 'general' | 'icon' | 'background' | 'preview';

export const AddAppSteppedDialog: React.FC<AddAppSteppedDialogProps> = ({ onClose }) => {
  const { addApp } = useAppContext();

  const [activeTab, setActiveTab] = useState<TabType>('general');

  // Form State
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [iconType, setIconType] = useState<'favicon' | 'upload' | 'library'>('favicon');
  const [iconUrl, setIconUrl] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('');
  const [error, setError] = useState('');

  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameInputRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Handle Save
  const handleSave = () => {
    setError('');
    if (!name.trim()) {
      setError('App Name is required');
      setActiveTab('general');
      return;
    }
    if (!url.trim() || !url.includes('.')) {
      setError('A valid website URL is required');
      setActiveTab('general');
      return;
    }

    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = `https://${finalUrl}`;
    }

    addApp({
      name: name.trim(),
      type: 'website',
      url: finalUrl,
      icon: iconUrl.trim() || undefined,
      background: backgroundColor || undefined,
    });

    onClose();
  };

  const handleNext = () => {
    if (activeTab === 'general') setActiveTab('icon');
    else if (activeTab === 'icon') setActiveTab('background');
    else if (activeTab === 'background') setActiveTab('preview');
    else handleSave();
  };

  const handleBack = () => {
    if (activeTab === 'preview') setActiveTab('background');
    else if (activeTab === 'background') setActiveTab('icon');
    else if (activeTab === 'icon') setActiveTab('general');
  };

  const computedFavicon = url.trim() ? getFaviconUrl(url.trim(), 128) : '';

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        {/* Left Sidebar Navigation */}
        <aside className={styles.sidebar}>
          <button
            className={`${styles.sidebarTab} ${activeTab === 'general' ? styles.activeSidebarTab : ''}`}
            onClick={() => setActiveTab('general')}
          >
            <span className={styles.tabIcon}>⚙️</span> Details
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
            <span className={styles.tabIcon}>🎨</span> Color
          </button>
          <button
            className={`${styles.sidebarTab} ${activeTab === 'preview' ? styles.activeSidebarTab : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            <span className={styles.tabIcon}>👁️</span> Preview
          </button>
        </aside>

        {/* Main Form Content */}
        <main className={styles.mainPanel}>
          <h2 className={styles.title}>Add Application</h2>

          {error && <div className={styles.errorMessage}>{error}</div>}

          {/* STEP 1: DETAILS */}
          {activeTab === 'general' && (
            <div className={styles.stepContent}>
              <div className={styles.field}>
                <label className={styles.label}>Application Name</label>
                <input
                  ref={nameInputRef}
                  className={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Spotify, YouTube, Netflix"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Website URL</label>
                <input
                  className={styles.input}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://open.spotify.com"
                />
              </div>
            </div>
          )}

          {/* STEP 2: ICON */}
          {activeTab === 'icon' && (
            <div className={styles.stepContent}>
              <div className={styles.segmentedHeader}>
                <button
                  className={`${styles.segmentBtn} ${iconType === 'favicon' ? styles.activeSegment : ''}`}
                  onClick={() => setIconType('favicon')}
                >
                  Favicon
                </button>
                <button
                  className={`${styles.segmentBtn} ${iconType === 'upload' ? styles.activeSegment : ''}`}
                  onClick={() => setIconType('upload')}
                >
                  Custom URL
                </button>
                <button
                  className={`${styles.segmentBtn} ${iconType === 'library' ? styles.activeSegment : ''}`}
                  onClick={() => setIconType('library')}
                >
                  Icon Emoji
                </button>
              </div>

              {iconType === 'favicon' && (
                <div className={styles.iconPreviewCard}>
                  <div className={styles.faviconIconCircle}>
                    {computedFavicon ? (
                      <img src={computedFavicon} alt="Favicon" className={styles.previewFaviconImg} />
                    ) : (
                      <span className={styles.initials}>{name ? name[0].toUpperCase() : '?'}</span>
                    )}
                  </div>
                  <div className={styles.domainText}>{url ? url.replace(/^https?:\/\//, '') : 'open.spotify.com'}</div>
                  <button className={styles.refreshBtn} type="button" onClick={() => setIconUrl('')}>
                    Refresh
                  </button>
                </div>
              )}

              {iconType === 'upload' && (
                <div className={styles.field}>
                  <label className={styles.label}>Custom Icon Image URL</label>
                  <input
                    className={styles.input}
                    value={iconUrl}
                    onChange={(e) => setIconUrl(e.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              )}

              {iconType === 'library' && (
                <div className={styles.iconLibraryGrid}>
                  {['🎵', '🎬', '🎮', '💼', '📧', '🚀', '📰', '🛒', '💬', '📺', '🔥', '⭐️'].map((emoji) => (
                    <button
                      key={emoji}
                      className={styles.libraryEmojiBtn}
                      onClick={() => setIconUrl(emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: COLOR */}
          {activeTab === 'background' && (
            <div className={styles.stepContent}>
              <div className={styles.field}>
                <label className={styles.label}>Tile Background Color</label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={backgroundColor || '#1db954'}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    style={{ width: 46, height: 46, border: 'none', background: 'transparent', cursor: 'pointer' }}
                  />
                  <input
                    className={styles.input}
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    placeholder="#1DB954 or linear-gradient(...)"
                  />
                </div>
              </div>

              <div className={styles.presetColors}>
                {['#E50914', '#1DB954', '#FF0000', '#00A8E1', '#24292e', '#D44638', '#171A21', '#107C10'].map(
                  (color) => (
                    <span
                      key={color}
                      className={styles.colorDot}
                      style={{ background: color }}
                      onClick={() => setBackgroundColor(color)}
                    />
                  )
                )}
              </div>
            </div>
          )}

          {/* STEP 4: PREVIEW */}
          {activeTab === 'preview' && (
            <div className={styles.stepContent} style={{ alignItems: 'center', justifyContent: 'center' }}>
              <div className={styles.previewCard} style={{ background: backgroundColor || '#1DB954' }}>
                <div className={styles.previewIconCircle}>
                  {iconUrl ? (
                    iconUrl.length <= 4 ? (
                      <span style={{ fontSize: 24 }}>{iconUrl}</span>
                    ) : (
                      <img src={iconUrl} alt="Icon" style={{ width: 40, height: 40, objectFit: 'contain' }} />
                    )
                  ) : computedFavicon ? (
                    <img src={computedFavicon} alt="Icon" style={{ width: 40, height: 40, objectFit: 'contain' }} />
                  ) : (
                    <span style={{ fontSize: 22, fontWeight: 700 }}>{name ? name[0] : 'S'}</span>
                  )}
                </div>
              </div>
              <div className={styles.previewName}>{name || 'Spotify'}</div>
            </div>
          )}

          {/* Action Buttons Footer */}
          <div className={styles.actionsFooter}>
            {activeTab !== 'general' && (
              <button type="button" className={styles.btnBack} onClick={handleBack}>
                Back
              </button>
            )}
            <div style={{ flex: 1 }} />
            <button type="button" className={styles.btnCancel} onClick={onClose}>
              Cancel
            </button>

            {activeTab !== 'preview' ? (
              <button type="button" className={styles.btnNext} onClick={handleNext}>
                Next Step
              </button>
            ) : (
              <button type="button" className={styles.btnNext} onClick={handleSave}>
                Save App
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
