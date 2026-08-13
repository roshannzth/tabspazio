import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useClock } from '../../hooks/useClock';
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
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack,
  onBack,
  onOpenSettings,
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
        <button
          className={styles.settingsIconBtn}
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
