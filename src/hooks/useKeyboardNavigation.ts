import { useState, useEffect, useCallback } from 'react';

interface UseKeyboardNavigationOptions {
  rows: string[][];
  onSelect: (id: string) => void;
  onBack?: () => void;
  enabled?: boolean;
}

export function useKeyboardNavigation(options: UseKeyboardNavigationOptions) {
  const { rows, onSelect, onBack, enabled = true } = options;
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!enabled || rows.length === 0) return;

    // Find current position
    let currentRow = 0;
    let currentCol = 0;
    
    if (focusedId) {
      for (let r = 0; r < rows.length; r++) {
        const c = rows[r].indexOf(focusedId);
        if (c !== -1) {
          currentRow = r;
          currentCol = c;
          break;
        }
      }
    } else {
      // Focus first item if none focused
      if (rows[0] && rows[0].length > 0) {
        setFocusedId(rows[0][0]);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowRight': {
        e.preventDefault();
        const nextCol = (currentCol + 1) % rows[currentRow].length;
        setFocusedId(rows[currentRow][nextCol]);
        break;
      }
      case 'ArrowLeft': {
        e.preventDefault();
        const prevCol = (currentCol - 1 + rows[currentRow].length) % rows[currentRow].length;
        setFocusedId(rows[currentRow][prevCol]);
        break;
      }
      case 'ArrowDown': {
        e.preventDefault();
        const nextRow = (currentRow + 1) % rows.length;
        if (rows[nextRow].length > 0) {
          const targetCol = Math.min(currentCol, rows[nextRow].length - 1);
          setFocusedId(rows[nextRow][targetCol]);
        }
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        const prevRow = (currentRow - 1 + rows.length) % rows.length;
        if (rows[prevRow].length > 0) {
          const targetCol = Math.min(currentCol, rows[prevRow].length - 1);
          setFocusedId(rows[prevRow][targetCol]);
        }
        break;
      }
      case 'Enter': {
        e.preventDefault();
        if (focusedId) {
          onSelect(focusedId);
        }
        break;
      }
      case 'Escape': {
        if (onBack) {
          e.preventDefault();
          onBack();
        }
        break;
      }
    }
  }, [enabled, rows, focusedId, onSelect, onBack]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return { focusedId, setFocusedId };
}
