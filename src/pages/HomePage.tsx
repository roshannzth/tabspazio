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
import { AddPageSteppedDialog } from '../components/dialogs/AddPageSteppedDialog';
import { AddCategoryDialog } from '../components/dialogs/AddCategoryDialog';
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
  const [showAddPage, setShowAddPage] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingApp, setEditingApp] = useState<App | null>(null);

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    app?: App;
  } | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'app' | 'page';
    id: string;
    name: string;
  } | null>(null);

  // Favorites for the top floating dock
  const favoriteApps = useMemo(() => {
    return apps.filter((app) => app.isFavorite !== false);
  }, [apps]);

  // Keyboard navigation rows (Favorites row)
  const rows = useMemo(() => {
    if (favoriteApps.length === 0) return [];
    return [favoriteApps.map((a) => a.id)];
  }, [favoriteApps]);

  const handleSelect = (appId: string) => {
    const app = apps.find((a) => a.id === appId);
    if (!app) return;

    if (app.type === 'page') {
      navigate(`/page/${app.pageId}`);
    } else if (app.type === 'website' && app.url) {
      openInNewTab(app.url);
    }
  };

  const { focusedId, setFocusedId } = useKeyboardNavigation({
    rows,
    onSelect: handleSelect,
    enabled: !showAllApps && !showAddApp && !showAddPage && !showAddCategory && !editingApp && !contextMenu && !deleteTarget,
  });

  const handleAppContextMenu = (e: React.MouseEvent, app: App) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, app });
  };

  const handleDuplicateApp = (app: App) => {
    addApp({
      name: `${app.name} (Copy)`,
      type: app.type,
      url: app.url,
      pageId: app.pageId,
      icon: app.icon,
      background: app.background,
      categoryId: app.categoryId,
      isFavorite: app.isFavorite,
    });
  };

  const hasNoApps = apps.length === 0;

  return (
    <div className={styles.container}>
      <Header onOpenSettings={() => navigate('/settings')} />

      {!isEditMode && <HeroHeader />}

      {hasNoApps ? (
        <EmptyState onAddApp={() => setShowAddApp(true)} />
      ) : (
        <div className={styles.mainContent}>
          {/* Favorites Floating Glass Dock Container */}
          <div className={styles.dockWrapper}>
            <div className={styles.floatingDock}>
              {favoriteApps.map((app) => (
                <AppCard
                  key={app.id}
                  app={app}
                  isFocused={focusedId === app.id}
                  onFocus={() => setFocusedId(app.id)}
                  onClick={() => (isEditMode ? setEditingApp(app) : handleSelect(app.id))}
                  onContextMenu={(e) => handleAppContextMenu(e, app)}
                  isEditMode={isEditMode}
                  onEdit={() => setEditingApp(app)}
                  onDelete={() => setDeleteTarget({ type: 'app', id: app.id, name: app.name })}
                />
              ))}
            </div>
          </div>

          {/* Centered Down Chevron (Opens All Apps Drawer Modal) */}
          <div className={styles.bottomChevronRow}>
            <button className={styles.chevronBtn} onClick={() => setShowAllApps(true)} title="All Applications (A-Z)">
              ∨
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
          onDeleteApp={(app) => setDeleteTarget({ type: 'app', id: app.id, name: app.name })}
          onDuplicateApp={(app) => handleDuplicateApp(app)}
          isEditMode={isEditMode}
        />
      )}

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onEdit={() => {
            if (contextMenu.app) setEditingApp(contextMenu.app);
          }}
          onDuplicate={() => {
            if (contextMenu.app) handleDuplicateApp(contextMenu.app);
          }}
          onDelete={() => {
            if (contextMenu.app) {
              setDeleteTarget({ type: 'app', id: contextMenu.app.id, name: contextMenu.app.name });
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
      {showAddPage && <AddPageSteppedDialog onClose={() => setShowAddPage(false)} />}
      {showAddCategory && <AddCategoryDialog onClose={() => setShowAddCategory(false)} />}
      {editingApp && <EditAppDialog app={editingApp} onClose={() => setEditingApp(null)} />}
    </div>
  );
}
