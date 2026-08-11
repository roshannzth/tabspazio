import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import styles from './Dialog.module.css';

interface AddCategoryDialogProps {
  onClose: () => void;
}

export function AddCategoryDialog({ onClose }: AddCategoryDialogProps) {
  const { addCategory } = useAppContext();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    inputRef.current?.focus();
    
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Category Name is required');
      return;
    }

    addCategory({ name: name.trim() });
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-label="Add Category">
      <div className={styles.dialog} onClick={e => e.stopPropagation()}>
        <h2 className={styles.title}>Add Category</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Category Name</label>
            <input ref={inputRef} className={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Streaming, Games" />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.actions}>
            <button type="button" className={styles.btnSecondary} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.btnPrimary}>Add Category</button>
          </div>
        </form>
      </div>
    </div>
  );
}
