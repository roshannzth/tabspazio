import React, { useMemo, useState } from 'react';
import { App } from '../../models/App';
import { AppCard } from './AppCard';
import styles from './AllAppsDrawer.module.css';

interface AllAppsDrawerProps {
  apps: App[];
  onClose: () => void;
  onSelectApp: (appId: string) => void;
  onToggleFavorite: (appId: string) => void;
  onAddApp: () => void;
  onEditApp: (app: App) => void;
  onDeleteApp: (app: App) => void;
  isEditMode?: boolean;
}

export const AllAppsDrawer: React.FC<AllAppsDrawerProps> = ({
  apps,
  onClose,
  onSelectApp,
  onToggleFavorite,
  onAddApp,
  onEditApp,
  onDeleteApp,
  isEditMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const filteredApps = useMemo(() => {
    const sorted = [...apps].sort((a, b) => a.name.localeCompare(b.name));
    if (!searchQuery.trim()) return sorted;
    return sorted.filter((app) => app.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [apps, searchQuery]);

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.drawerHeader}>
        <div className={styles.headerTitleGroup}>
          <h2 className={styles.title}>All Applications</h2>
          <span className={styles.subtitle}>{filteredApps.length} Apps Installed</span>
        </div>

        <div className={styles.searchGroup}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>

        <button className={styles.closeBtn} onClick={onClose} title="Close All Apps">
          ✕
        </button>
      </div>

      <div className={styles.gridContainer}>
        <div className={styles.appsGrid}>
          {filteredApps.map((app) => (
            <div key={app.id} className={styles.appCardContainer}>
              <AppCard
                app={app}
                isFocused={focusedId === app.id}
                onFocus={() => setFocusedId(app.id)}
                onClick={() => onSelectApp(app.id)}
                showFavoriteToggle={true}
                onToggleFavorite={() => onToggleFavorite(app.id)}
                isEditMode={isEditMode}
                onEdit={() => onEditApp(app)}
                onDelete={() => onDeleteApp(app)}
              />
              <span className={styles.appNameText}>{app.name}</span>
            </div>
          ))}

          <div className={styles.addAppTile} onClick={onAddApp}>
            <span className={styles.addIcon}>+</span>
            <span className={styles.addText}>Add App</span>
          </div>
        </div>
      </div>
    </div>
  );
};
