import React, { useState, useRef, useEffect } from 'react';
import styles from './CustomSelect.module.css';

export interface SelectOption {
  label: string;
  value: string | number;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string | number;
  onChange: (value: any) => void;
  placeholder?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className={styles.selectContainer} ref={containerRef}>
      <button
        type="button"
        className={`${styles.selectButton} ${isOpen ? styles.openButton : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.label}>{selectedOption ? selectedOption.label : placeholder}</span>
        <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}>∨</span>
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu} role="listbox">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={String(option.value)}
                type="button"
                className={`${styles.optionItem} ${isSelected ? styles.selectedOption : ''}`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                <span>{option.label}</span>
                {isSelected && <span className={styles.checkMark}>✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
