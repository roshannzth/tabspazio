import React, { useState } from 'react';
import { App } from '../../models/App';
import { getFaviconUrl, getInitials, getColorFromString } from '../../services/favicon';
import styles from './CircularAppTile.module.css';

interface CircularAppTileProps {
  app: App;
  isFocused: boolean;
  onFocus: () => void;
  onClick: () => void;
  isEditMode?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const CircularAppTile: React.FC<CircularAppTileProps> = ({
  app,
  isFocused,
  onFocus,
  onClick,
  isEditMode,
  onEdit,
  onDelete,
}) => {
  const [imageError, setImageError] = useState(false);

  // Compute brand styling
  const bgColor = app.background || getColorFromString(app.name);
  const faviconUrl = app.icon || (app.url ? getFaviconUrl(app.url, 128) : null);
  const initials = getInitials(app.name);

  return (
    <div
      tabIndex={0}
      role="button"
      aria-label={app.name}
      className={`${styles.tileWrapper} ${isFocused ? styles.focused : ''}`}
      onClick={onClick}
      onMouseEnter={onFocus}
      onFocus={onFocus}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div 
        className={styles.circleDisc}
        style={{ 
          background: app.background 
            ? (app.name.toLowerCase() === 'netflix' || app.name.toLowerCase() === 'youtube' ? '#ffffff' : app.background) 
            : bgColor 
        }}
      >
        {faviconUrl && !imageError ? (
          <img
            src={faviconUrl}
            alt={app.name}
            className={styles.appLogo}
            onError={() => setImageError(true)}
          />
        ) : (
          <span 
            className={styles.initials} 
            style={{ color: app.name.toLowerCase() === 'netflix' || app.name.toLowerCase() === 'youtube' ? '#E50914' : '#ffffff' }}
          >
            {initials}
          </span>
        )}
      </div>

      <span className={styles.label}>{app.name}</span>

      {isEditMode && (
        <div className={styles.editControls}>
          {onEdit && (
            <button
              className={styles.editBtn}
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              title="Edit App"
            >
              ✎
            </button>
          )}
          {onDelete && (
            <button
              className={`${styles.editBtn} ${styles.deleteBtn}`}
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
      )}
    </div>
  );
};
