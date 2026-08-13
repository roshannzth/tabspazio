import React from 'react';
import { CustomPage } from '../../models/Page';
import styles from './PageCard.module.css';

interface PageCardProps {
  page: CustomPage;
  appCount: number;
  isFocused: boolean;
  onFocus: () => void;
  onClick: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  isEditMode?: boolean;
  onDelete?: () => void;
}

export const PageCard: React.FC<PageCardProps> = ({
  page,
  appCount,
  isFocused,
  onFocus,
  onClick,
  onContextMenu,
  isEditMode,
  onDelete,
}) => {
  return (
    <div
      tabIndex={0}
      role="button"
      className={`${styles.pageCard} ${isFocused ? styles.focused : ''}`}
      onClick={onClick}
      onMouseEnter={onFocus}
      onFocus={onFocus}
      onContextMenu={onContextMenu}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className={styles.iconSquare} style={{ background: page.background || 'rgba(255, 255, 255, 0.1)' }}>
        <span className={styles.iconText}>{page.icon || '📄'}</span>
      </div>

      <div className={styles.textContainer}>
        <div className={styles.title}>{page.name}</div>
        <div className={styles.subtext}>{appCount} Apps</div>
      </div>

      {isEditMode && onDelete && (
        <button
          className={styles.deleteBadge}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title="Delete Page"
        >
          ✕
        </button>
      )}
    </div>
  );
};
