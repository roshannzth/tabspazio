import React, { useState } from 'react';
import { App } from '../../models/App';
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
  showFavoriteToggle?: boolean;
  onToggleFavorite?: () => void;
}

export function AppCard({
  app,
  isFocused,
  onFocus,
  onClick,
  onContextMenu,
  isEditMode,
  onDelete,
  showFavoriteToggle,
  onToggleFavorite,
}: AppCardProps) {
  const [imageError, setImageError] = useState(false);

  const faviconUrl = app.icon || (app.url ? getFaviconUrl(app.url, 128) : null);
  const initials = getInitials(app.name);
  const bgColor = app.background || getColorFromString(app.name);

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
      style={{ background: bgColor }}
      onClick={onClick}
      onMouseEnter={onFocus}
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

      {showFavoriteToggle && onToggleFavorite && (
        <button
          className={`${styles.favoriteBadge} ${app.isFavorite ? styles.activeFav : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          title={app.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        >
          {app.isFavorite ? '★' : '☆'}
        </button>
      )}

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
