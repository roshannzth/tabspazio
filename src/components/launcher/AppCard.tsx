import React, { useState } from 'react';
import { App } from '../../models/App';
import { useSettings } from '../../hooks/useSettings';
import { getFaviconUrl, getInitials, getColorFromString } from '../../services/favicon';
import styles from './AppCard.module.css';

interface AppCardProps {
  app: App;
  isFocused: boolean;
  onFocus: () => void;
  onClick: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  isEditMode?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function AppCard({
  app,
  isFocused,
  onFocus,
  onClick,
  onContextMenu,
  isEditMode,
  onDelete,
}: AppCardProps) {
  const [imageError, setImageError] = useState(false);
  const { settings } = useSettings();
  const { appearance } = settings;

  const faviconUrl = app.icon || (app.url ? getFaviconUrl(app.url, 128) : null);
  const initials = getInitials(app.name);
  const bgColor = app.background || getColorFromString(app.name);

  const accentColor = appearance.accentColor || '#ffffff';
  const borderRadius = appearance.borderRadius ? `${appearance.borderRadius}px` : undefined;

  const cardStyle: React.CSSProperties = {
    background: bgColor,
    ...(borderRadius ? { borderRadius } : {}),
    ['--accent-glow' as any]: accentColor,
  };

  if (isFocused) {
    cardStyle.borderColor = accentColor;
    cardStyle.boxShadow = `0 0 0 3.5px ${accentColor}, 0 16px 40px rgba(0, 0, 0, 0.85)`;
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={isFocused ? 0 : -1}
      aria-label={app.name}
      className={`${styles.card} ${isFocused ? styles.focused : ''}`}
      style={cardStyle}
      onClick={onClick}
      onFocus={onFocus}
      onContextMenu={onContextMenu}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.iconWrapper}>
        {faviconUrl && !imageError ? (
          <img
            src={faviconUrl}
            alt={app.name}
            className={styles.appLogo}
            onError={() => setImageError(true)}
          />
        ) : (
          <span className={styles.initials}>{initials}</span>
        )}
      </div>

      {isEditMode && onDelete && (
        <button
          className={styles.deleteBadge}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title="Delete App"
        >
          ✕
        </button>
      )}
    </div>
  );
}
