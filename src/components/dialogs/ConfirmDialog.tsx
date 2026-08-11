import React, { useEffect, useRef } from 'react';
import styles from './Dialog.module.css';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDanger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDanger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    confirmBtnRef.current?.focus();
    
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onCancel]);

  return (
    <div className={styles.overlay} onClick={onCancel} role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <div className={styles.dialog} onClick={e => e.stopPropagation()}>
        <h2 id="dialog-title" className={styles.title}>{title}</h2>
        <div style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.5 }}>
          {message}
        </div>
        <div className={styles.actions}>
          <button className={styles.btnSecondary} onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            ref={confirmBtnRef}
            className={isDanger ? styles.btnDanger : styles.btnPrimary}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
