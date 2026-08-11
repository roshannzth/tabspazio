import React from 'react';
import { App } from '../../models/App';
import { Category } from '../../models/Category';
import { CategoryRow } from './CategoryRow';
import styles from './AppGrid.module.css';

interface AppGridProps {
  apps: App[];
  categories: Category[];
  focusedId: string | null;
  onFocusApp: (id: string) => void;
  onClickApp: (app: App) => void;
  onEditApp?: (app: App) => void;
  onDeleteApp?: (app: App) => void;
  isEditMode?: boolean;
  showCategoryLabels?: boolean;
  showAddButton?: boolean;
  onAddApp?: () => void;
}

export function AppGrid({
  apps,
  categories,
  focusedId,
  onFocusApp,
  onClickApp,
  onEditApp,
  onDeleteApp,
  isEditMode,
  showCategoryLabels = true,
  showAddButton = false,
  onAddApp,
}: AppGridProps) {
  const uncategorizedApps = apps.filter(a => !a.categoryId);
  
  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  return (
    <div className={styles.grid}>
      {sortedCategories.map(category => {
        const categoryApps = apps.filter(a => a.categoryId === category.id).sort((a, b) => a.order - b.order);
        return (
          <CategoryRow
            key={category.id}
            category={category}
            apps={categoryApps}
            focusedId={focusedId}
            onFocusApp={onFocusApp}
            onClickApp={onClickApp}
            onEditApp={onEditApp}
            onDeleteApp={onDeleteApp}
            isEditMode={isEditMode}
            showLabel={showCategoryLabels}
          />
        );
      })}

      {(uncategorizedApps.length > 0 || showAddButton) && (
        <div className={styles.uncategorizedRow}>
          <CategoryRow
            category={null}
            apps={uncategorizedApps.sort((a, b) => a.order - b.order)}
            focusedId={focusedId}
            onFocusApp={onFocusApp}
            onClickApp={onClickApp}
            onEditApp={onEditApp}
            onDeleteApp={onDeleteApp}
            isEditMode={isEditMode}
            showLabel={false}
          />
          {showAddButton && onAddApp && (
            <div 
              className={styles.addAppCard}
              role="button"
              tabIndex={0}
              onClick={onAddApp}
              aria-label="Add App"
            >
              <div className={styles.addIcon}>+</div>
              <div className={styles.addText}>Add App</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
