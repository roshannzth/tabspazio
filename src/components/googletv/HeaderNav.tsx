import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CustomPage } from '../../models/Page';
import styles from './HeaderNav.module.css';

interface HeaderNavProps {
  pages: CustomPage[];
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  onOpenSearch?: () => void;
  onOpenSettings?: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  pages,
  activeTab,
  onSelectTab,
  onOpenSearch,
  onOpenSettings,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (tabId: string) => {
    onSelectTab(tabId);
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftNav}>
        <div className={styles.avatarCircle} title="User Profile">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>

        <nav className={styles.tabsNav} aria-label="Main Navigation">
          <button
            className={`${styles.tabBtn} ${activeTab === 'for-you' ? styles.activeTab : ''}`}
            onClick={() => handleNavClick('for-you')}
          >
            For you
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'movies' ? styles.activeTab : ''}`}
            onClick={() => handleNavClick('movies')}
          >
            Movies
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'shows' ? styles.activeTab : ''}`}
            onClick={() => handleNavClick('shows')}
          >
            Shows
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'apps' ? styles.activeTab : ''}`}
            onClick={() => handleNavClick('apps')}
          >
            Apps
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'library' ? styles.activeTab : ''}`}
            onClick={() => handleNavClick('library')}
          >
            Library
          </button>

          {pages.map((p) => (
            <button
              key={p.id}
              className={`${styles.tabBtn} ${activeTab === p.id ? styles.activeTab : ''}`}
              onClick={() => handleNavClick(p.id)}
            >
              {p.name}
            </button>
          ))}
        </nav>
      </div>

      <div className={styles.rightNav}>
        <button
          className={styles.iconBtn}
          onClick={onOpenSearch}
          title="Search"
          aria-label="Search"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>

        <button
          className={styles.iconBtn}
          onClick={() => {
            if (onOpenSettings) onOpenSettings();
            else navigate('/settings');
          }}
          title="Settings"
          aria-label="Settings"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>

        <div className={styles.brandTitle}>Google TV</div>
      </div>
    </header>
  );
};
