import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useClock } from '../../hooks/useClock';
import { WeatherWidget } from '../launcher/WeatherWidget';
import styles from './Header.module.css';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  isEditMode?: boolean;
  onToggleEdit?: () => void;
  onDoneEdit?: () => void;
  onOpenSettings?: () => void;
  onOpenSearch?: () => void;
  onToggleDock?: () => void;
  isDockHidden?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack,
  onBack,
  onOpenSettings,
  onToggleDock,
  isDockHidden,
}) => {
  const navigate = useNavigate();
  const { time } = useClock();

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        {showBack && (
          <button
            className={styles.iconBtn}
            onClick={onBack || (() => navigate('/'))}
            title="Back"
          >
            ←
          </button>
        )}
        {title && <h1 className={styles.title}>{title}</h1>}
      </div>

      <div className={styles.rightSection}>
        <WeatherWidget />

        {onToggleDock && (
          <button
            className={`${styles.iconBtn} ${isDockHidden ? styles.iconBtnActive : ''}`}
            onClick={onToggleDock}
            title={isDockHidden ? 'Show App Dock' : 'Hide App Dock'}
          >
            {isDockHidden ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}

        <button
          className={styles.iconBtn}
          onClick={onOpenSettings || (() => navigate('/settings'))}
          title="Settings"
        >
          ⚙️
        </button>

        <span className={styles.timeDisplay}>{time}</span>
      </div>
    </header>
  );
};
