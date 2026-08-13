import React from 'react';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  onAddApp: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onAddApp }) => {
  return (
    <div className={styles.container}>
      <div className={styles.iconBox}>
        <div className={styles.gridSquare} />
        <div className={styles.gridSquare} />
        <div className={styles.gridSquare} />
        <div className={styles.gridSquare} />
      </div>

      <h2 className={styles.title}>You don't have any apps yet!</h2>
      <p className={styles.subtitle}>Add your favorite websites and pages to get started.</p>

      <button className={styles.addBtn} onClick={onAddApp}>
        + Add App
      </button>
    </div>
  );
};
