import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { openInNewTab } from '../browser/tabs';
import { Header } from '../components/common/Header';
import { AppCard } from '../components/launcher/AppCard';
import { ContextMenu } from '../components/launcher/ContextMenu';
import { AddAppSteppedDialog } from '../components/dialogs/AddAppSteppedDialog';
import { EditAppDialog } from '../components/dialogs/EditAppDialog';
import { ConfirmDeleteDialog } from '../components/dialogs/ConfirmDeleteDialog';
import { App } from '../models/App';
import styles from './HomePage.module.css';

export default function CustomPageView() {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();
  const { pages, apps, deleteApp, addApp } = useAppContext();

  const [isEditMode, setIsEditMode] = useState(false);
  const [showAddApp, setShowAddApp] = useState(false);
  const [editingApp, setEditingApp] = useState<App | null>(null);

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; app: App } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<App | null>(null);

  const page = pages.find((p) => p.id === pageId);
  const pageApps = useMemo(() => {
    if (!page) return [];
    return apps.filter((a) => page.apps.includes(a.id)).sort((a, b) => a.order - b.order);
  }, [page, apps]);

  const rows = useMemo(() => {
    if (pageApps.length === 0) return [];
    const cols = 6;
    const r: string[][] = [];
    for (let i = 0; i < pageApps.length; i += cols) {
      r.push(pageApps.slice(i, i + cols).map((a) => a.id));
    }
    return r;
  }, [pageApps]);

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
    onBack: () => navigate('/'),
    enabled: !editingApp && !showAddApp && !contextMenu && !deleteTarget,
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
    });
  };

  if (!page) {
    return (
      <div className={styles.container}>
        <Header showBack onBack={() => navigate('/')} />
        <div style={{ padding: '80px 48px', color: '#fff' }}>
          <h2>Page not found</h2>
          <button
            onClick={() => navigate('/')}
            style={{
              background: '#6366f1',
              color: '#ffffff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '9999px',
              cursor: 'pointer',
              marginTop: '20px',
              fontWeight: 600,
            }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header
        title={page.name}
        showBack
        onBack={() => navigate('/')}
        isEditMode={isEditMode}
        onDoneEdit={() => setIsEditMode(false)}
        onOpenSettings={() => navigate('/settings')}
      />

      <div style={{ padding: '20px 48px' }}>
        <div className={styles.rowGrid} style={{ flexWrap: 'wrap' }}>
          {pageApps.map((app) => (
            <AppCard
              key={app.id}
              app={app}
              isFocused={focusedId === app.id}
              onFocus={() => setFocusedId(app.id)}
              onClick={() => (isEditMode ? setEditingApp(app) : handleSelect(app.id))}
              onContextMenu={(e) => handleAppContextMenu(e, app)}
              isEditMode={isEditMode}
              onEdit={() => setEditingApp(app)}
              onDelete={() => setDeleteTarget(app)}
            />
          ))}

          <div className={styles.addCard} onClick={() => setShowAddApp(true)}>
            <span className={styles.addIcon}>+</span>
            <span className={styles.addLabel}>Add App</span>
          </div>
        </div>
      </div>

      <div className={styles.floatingControls}>
        <button
          className={`${styles.fabBtn} ${isEditMode ? styles.activeFab : ''}`}
          onClick={() => setIsEditMode(!isEditMode)}
          title="Edit Mode"
        >
          ✎
        </button>
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onEdit={() => setEditingApp(contextMenu.app)}
          onDuplicate={() => handleDuplicateApp(contextMenu.app)}
          onDelete={() => setDeleteTarget(contextMenu.app)}
        />
      )}

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

      {showAddApp && <AddAppSteppedDialog onClose={() => setShowAddApp(false)} />}
      {editingApp && <EditAppDialog app={editingApp} onClose={() => setEditingApp(null)} />}
    </div>
  );
}
