import React, { useEffect, useRef } from 'react';
import styles from './ContextMenu.module.css';

interface ContextMenuProps {
  x: number;
  y: number;
  onEdit: () => void;
  onMoveToPage?: () => void;
  onChangeCategory?: () => void;
  onDuplicate?: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  onEdit,
  onMoveToPage,
  onChangeCategory,
  onDuplicate,
  onDelete,
  onClose,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Adjust positioning to stay on screen
  const adjustedX = Math.min(x, window.innerWidth - 220);
  const adjustedY = Math.min(y, window.innerHeight - 240);

  return (
    <div
      ref={menuRef}
      className={styles.contextMenu}
      style={{ left: `${adjustedX}px`, top: `${adjustedY}px` }}
    >
      <button className={styles.menuItem} onClick={() => { onEdit(); onClose(); }}>
        <span className={styles.icon}>✏️</span> Edit App
      </button>
      {onMoveToPage && (
        <button className={styles.menuItem} onClick={() => { onMoveToPage(); onClose(); }}>
          <span className={styles.icon}>📂</span> Move to Page
        </button>
      )}
      {onChangeCategory && (
        <button className={styles.menuItem} onClick={() => { onChangeCategory(); onClose(); }}>
          <span className={styles.icon}>🔲</span> Change Category
        </button>
      )}
      {onDuplicate && (
        <button className={styles.menuItem} onClick={() => { onDuplicate(); onClose(); }}>
          <span className={styles.icon}>📋</span> Duplicate
        </button>
      )}
      <div className={styles.divider} />
      <button className={`${styles.menuItem} ${styles.deleteItem}`} onClick={() => { onDelete(); onClose(); }}>
        <span className={styles.icon}>🗑️</span> Delete
      </button>
    </div>
  );
};
