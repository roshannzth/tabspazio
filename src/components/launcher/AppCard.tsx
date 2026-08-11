import React, { useState } from 'react';
import { App } from '../../models/App';
import { getFaviconUrl } from '../../services/favicon';
import { FallbackIcon } from '../common/FallbackIcon';
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
  onEdit,
  onDelete,
}: AppCardProps) {
  const [imageError, setImageError] = useState(false);

  const getIconSource = () => {
    if (app.icon) return app.icon;
    if (app.url && app.type === 'website') return getFaviconUrl(app.url, 64);
    return null;
  };

  const iconSrc = getIconSource();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  const bgStyle = app.background
    ? { background: `linear-gradient(to bottom, rgba(255,255,255,0.05), rgba(0,0,0,0.2)), ${app.background}` }
    : {};

  return (
    <div
      role="button"
      tabIndex={isFocused ? 0 : -1}
      aria-label={app.name}
      className={`${styles.card} ${isFocused ? styles.focused : ''}`}
      style={bgStyle}
      onClick={onClick}
      onMouseEnter={onFocus}
      onContextMenu={onContextMenu}
      onKeyDown={handleKeyDown}
    >
      {iconSrc && !imageError ? (
        <img
          src={iconSrc}
          alt={app.name}
          className={styles.icon}
          onError={() => setImageError(true)}
        />
      ) : (
        <div className={styles.iconWrapper}>
          <FallbackIcon name={app.name} background={app.background} size={48} />
        </div>
      )}
      <div className={styles.name}>{app.name}</div>

      {isEditMode && (
        <div className={styles.editButtons} onClick={(e) => e.stopPropagation()}>
          {onEdit && (
            <button className={styles.editBtn} onClick={onEdit} aria-label="Edit">
              ✎
            </button>
          )}
          {onDelete && (
            <button className={styles.editBtn} onClick={onDelete} aria-label="Delete">
              ×
            </button>
          )}
        </div>
      )}
    </div>
  );
}
