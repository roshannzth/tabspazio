import React, { useMemo, useState } from 'react';
import { App } from '../../models/App';
import { AppCard } from './AppCard';
import { ContextMenu } from './ContextMenu';
import styles from './AllAppsDrawer.module.css';

interface AllAppsDrawerProps {
  apps: App[];
  onClose: () => void;
  onSelectApp: (appId: string) => void;
  onToggleFavorite: (appId: string) => void;
  onAddApp: () => void;
  onEditApp: (app: App) => void;
  onDeleteApp: (app: App) => void;
  onDuplicateApp: (app: App) => void;
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
  onDuplicateApp,
  isEditMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; app: App } | null>(null);

  const filteredApps = useMemo(() => {
    const sorted = [...apps].sort((a, b) => a.name.localeCompare(b.name));
    if (!searchQuery.trim()) return sorted;
    return sorted.filter((app) => app.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [apps, searchQuery]);

  const handleContextMenu = (e: React.MouseEvent, app: App) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, app });
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    // If scrolling up when at top of list, return to homescreen
    if (e.deltaY < -25 && e.currentTarget.scrollTop <= 0) {
      onClose();
    }
  };

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

        <button className={styles.closeBtn} onClick={onClose} title="Return to Homescreen">
          ✕
        </button>
      </div>

      <div className={styles.gridContainer} onWheel={handleWheel}>
        <div className={styles.appsGrid}>
          {filteredApps.map((app) => (
            <div key={app.id} className={styles.appCardContainer}>
              <AppCard
                app={app}
                isFocused={focusedId === app.id}
                onFocus={() => setFocusedId(app.id)}
                onClick={() => onSelectApp(app.id)}
                onContextMenu={(e) => handleContextMenu(e, app)}
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

      {/* Floating Context Menu inside All Apps Drawer */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          isFavorite={Boolean(contextMenu.app.isFavorite)}
          onToggleFavorite={() => onToggleFavorite(contextMenu.app.id)}
          onClose={() => setContextMenu(null)}
          onEdit={() => onEditApp(contextMenu.app)}
          onDuplicate={() => onDuplicateApp(contextMenu.app)}
          onDelete={() => onDeleteApp(contextMenu.app)}
        />
      )}
    </div>
  );
};
