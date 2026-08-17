import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { openInNewTab } from '../browser/tabs';
import { Header } from '../components/common/Header';
import { HeroHeader } from '../components/launcher/HeroHeader';
import { AppCard } from '../components/launcher/AppCard';
import { AllAppsDrawer } from '../components/launcher/AllAppsDrawer';
import { ContextMenu } from '../components/launcher/ContextMenu';
import { EmptyState } from '../components/launcher/EmptyState';
import { AddAppSteppedDialog } from '../components/dialogs/AddAppSteppedDialog';
import { EditAppDialog } from '../components/dialogs/EditAppDialog';
import { ConfirmDeleteDialog } from '../components/dialogs/ConfirmDeleteDialog';
import { App } from '../models/App';
import styles from './HomePage.module.css';

export default function HomePage() {
  const { apps, deleteApp, addApp, toggleFavorite } = useAppContext();
  const navigate = useNavigate();

  const [isEditMode, setIsEditMode] = useState(false);
  const [showAllApps, setShowAllApps] = useState(false);
  const [showAddApp, setShowAddApp] = useState(false);
  const [editingApp, setEditingApp] = useState<App | null>(null);

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    app?: App;
  } | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Favorites for the top floating dock (only apps explicitly marked as isFavorite: true)
  const favoriteApps = useMemo(() => {
    return apps.filter((app) => Boolean(app.isFavorite));
  }, [apps]);

  // Keyboard navigation rows (Favorites row)
  const rows = useMemo(() => {
    if (favoriteApps.length === 0) return [];
    return [favoriteApps.map((a) => a.id)];
  }, [favoriteApps]);

  const handleSelect = (appId: string) => {
    const app = apps.find((a) => a.id === appId);
    if (!app || !app.url) return;
    openInNewTab(app.url);
  };

  const { focusedId, setFocusedId } = useKeyboardNavigation({
    rows,
    onSelect: handleSelect,
    enabled: !showAllApps && !showAddApp && !editingApp && !contextMenu && !deleteTarget,
  });

  const handleAppContextMenu = (e: React.MouseEvent, app: App) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, app });
  };

  const handleDuplicateApp = (app: App) => {
    addApp({
      name: `${app.name} (Copy)`,
      type: 'website',
      url: app.url,
      icon: app.icon,
      background: app.background,
      isFavorite: app.isFavorite,
    });
  };

  const handleWheel = (e: React.WheelEvent) => {
    // Scrolling down on homescreen opens All Applications drawer
    if (e.deltaY > 30 && !showAllApps && !showAddApp && !editingApp && !contextMenu && !deleteTarget) {
      setShowAllApps(true);
    }
  };

  const handleDockWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    // Smooth horizontal scroll for the favorite dock
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.stopPropagation();
      e.currentTarget.scrollLeft += e.deltaY * 1.5;
    }
  };

  const hasNoApps = apps.length === 0;

  return (
    <div className={styles.container} onWheel={handleWheel}>
      <Header onOpenSettings={() => navigate('/settings')} />

      {!isEditMode && <HeroHeader />}

      {hasNoApps ? (
        <EmptyState onAddApp={() => setShowAddApp(true)} />
      ) : (
        <div className={styles.mainContent}>
          {/* Favorites Floating Glass Dock Container with Smooth Horizontal Scroll */}
          {favoriteApps.length > 0 && (
            <div className={styles.dockWrapper}>
              <div
                className={styles.floatingDock}
                onWheel={handleDockWheel}
                onMouseLeave={() => setFocusedId(null)}
              >
                {favoriteApps.map((app) => (
                  <div
                    key={app.id}
                    className={`${styles.dockCardWrapper} ${focusedId === app.id ? styles.dockCardFocused : ''}`}
                  >
                    <AppCard
                      app={app}
                      isFocused={focusedId === app.id}
                      onFocus={() => setFocusedId(app.id)}
                      onClick={() => (isEditMode ? setEditingApp(app) : handleSelect(app.id))}
                      onContextMenu={(e) => handleAppContextMenu(e, app)}
                      isEditMode={isEditMode}
                      onEdit={() => setEditingApp(app)}
                      onDelete={() => setDeleteTarget({ id: app.id, name: app.name })}
                    />
                    <div className={styles.dockTooltip}>
                      {app.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Centered Glass Pill Button for All Applications */}
          <div className={styles.bottomChevronRow}>
            <button className={styles.chevronBtn} onClick={() => setShowAllApps(true)} title="All Applications (A-Z)">
              <span>All Apps</span>
              <svg className={styles.chevronIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* All Applications Full-Screen Drawer */}
      {showAllApps && (
        <AllAppsDrawer
          apps={apps}
          onClose={() => setShowAllApps(false)}
          onSelectApp={(appId) => {
            setShowAllApps(false);
            handleSelect(appId);
          }}
          onToggleFavorite={(appId) => toggleFavorite(appId)}
          onAddApp={() => setShowAddApp(true)}
          onEditApp={(app) => setEditingApp(app)}
          onDeleteApp={(app) => setDeleteTarget({ id: app.id, name: app.name })}
          onDuplicateApp={(app) => handleDuplicateApp(app)}
          isEditMode={isEditMode}
        />
      )}

      {/* Context Menu on Homescreen */}
      {contextMenu && contextMenu.app && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          isFavorite={Boolean(contextMenu.app.isFavorite)}
          onToggleFavorite={() => toggleFavorite(contextMenu.app!.id)}
          onClose={() => setContextMenu(null)}
          onEdit={() => {
            if (contextMenu.app) setEditingApp(contextMenu.app);
          }}
          onDuplicate={() => {
            if (contextMenu.app) handleDuplicateApp(contextMenu.app);
          }}
          onDelete={() => {
            if (contextMenu.app) {
              setDeleteTarget({ id: contextMenu.app.id, name: contextMenu.app.name });
            }
          }}
        />
      )}

      {/* Confirm Delete Dialog */}
      {deleteTarget && (
        <ConfirmDeleteDialog
          title={`Delete "${deleteTarget.name}" app?`}
          message="This action cannot be undone."
          onConfirm={() => {
            deleteApp(deleteTarget.id);
            setDeleteTarget(null);
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Dialogs */}
      {showAddApp && <AddAppSteppedDialog onClose={() => setShowAddApp(false)} />}
      {editingApp && <EditAppDialog app={editingApp} onClose={() => setEditingApp(null)} />}
    </div>
  );
}
