import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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

interface SortableDockCardProps {
  app: App;
  isFocused: boolean;
  onFocus: () => void;
  onClick: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  isEditMode?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  isDraggingActive?: boolean;
}

function SortableDockCard({
  app,
  isFocused,
  onFocus,
  onClick,
  onContextMenu,
  isEditMode,
  onEdit,
  onDelete,
  isDraggingActive,
}: SortableDockCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: app.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
    zIndex: isDragging ? 100 : undefined,
    touchAction: 'none',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`${styles.dockCardWrapper} ${isFocused ? styles.dockCardFocused : ''} ${isDragging ? styles.dockCardDragging : ''}`}
    >
      <AppCard
        app={app}
        isFocused={isFocused && !isDraggingActive}
        onFocus={onFocus}
        onClick={onClick}
        onContextMenu={onContextMenu}
        isEditMode={isEditMode}
        onEdit={onEdit}
        onDelete={onDelete}
      />
      {!isDragging && !isDraggingActive && (
        <div className={styles.dockTooltip}>{app.name}</div>
      )}
    </div>
  );
}

export default function HomePage() {
  const { apps, deleteApp, addApp, reorderApps, toggleFavorite } = useAppContext();
  const navigate = useNavigate();

  const [isEditMode, setIsEditMode] = useState(false);
  const [showAllApps, setShowAllApps] = useState(false);
  const [showAddApp, setShowAddApp] = useState(false);
  const [editingApp, setEditingApp] = useState<App | null>(null);

  const [isDockHidden, setIsDockHidden] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      const val = localStorage.getItem('tabspazioDockHidden') ?? localStorage.getItem('tvLauncherDockHidden');
      return val === 'true';
    }
    return false;
  });

  const handleToggleDock = () => {
    setIsDockHidden((prev) => {
      const next = !prev;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('tabspazioDockHidden', String(next));
      }
      return next;
    });
  };

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    app?: App;
  } | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Favorites for the floating dock (sorted by order)
  const favoriteApps = useMemo(() => {
    return apps
      .filter((app) => Boolean(app.isFavorite))
      .sort((a, b) => a.order - b.order);
  }, [apps]);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6, // Allows regular clicks without triggering accidental drags
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(String(event.active.id));
    setFocusedId(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragId(null);
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = favoriteApps.findIndex((a) => a.id === active.id);
      const newIndex = favoriteApps.findIndex((a) => a.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(favoriteApps, oldIndex, newIndex);
        reorderApps(newOrder.map((a) => a.id));
      }
    }
  };

  // Keyboard navigation rows (Favorites row)
  const rows = useMemo(() => {
    if (favoriteApps.length === 0 || isDockHidden) return [];
    return [favoriteApps.map((a) => a.id)];
  }, [favoriteApps, isDockHidden]);

  const handleSelect = (appId: string) => {
    const app = apps.find((a) => a.id === appId);
    if (!app || !app.url) return;
    openInNewTab(app.url);
  };

  const { focusedId, setFocusedId } = useKeyboardNavigation({
    rows,
    onSelect: handleSelect,
    enabled: !showAllApps && !showAddApp && !editingApp && !contextMenu && !deleteTarget && !isDockHidden && !activeDragId,
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
    if (e.deltaY > 30 && !showAllApps && !showAddApp && !editingApp && !contextMenu && !deleteTarget && !activeDragId) {
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
      <Header
        onOpenSettings={() => navigate('/settings')}
        onToggleDock={handleToggleDock}
        isDockHidden={isDockHidden}
      />

      {!isEditMode && <HeroHeader />}

      {hasNoApps ? (
        <EmptyState onAddApp={() => setShowAddApp(true)} />
      ) : (
        <div className={`${styles.mainContent} ${isDockHidden ? styles.dockHidden : ''}`}>
          {/* Favorites Floating Glass Dock Container with Drag-and-Drop Reordering */}
          {favoriteApps.length > 0 && (
            <div className={styles.dockWrapper}>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={favoriteApps.map((a) => a.id)}
                  strategy={horizontalListSortingStrategy}
                >
                  <div
                    className={styles.floatingDock}
                    onWheel={handleDockWheel}
                    onMouseLeave={() => {
                      if (!activeDragId) setFocusedId(null);
                    }}
                  >
                    {favoriteApps.map((app) => (
                      <SortableDockCard
                        key={app.id}
                        app={app}
                        isFocused={focusedId === app.id}
                        onFocus={() => {
                          if (!activeDragId) setFocusedId(app.id);
                        }}
                        onClick={() => (isEditMode ? setEditingApp(app) : handleSelect(app.id))}
                        onContextMenu={(e) => handleAppContextMenu(e, app)}
                        isEditMode={isEditMode}
                        onEdit={() => setEditingApp(app)}
                        onDelete={() => setDeleteTarget({ id: app.id, name: app.name })}
                        isDraggingActive={Boolean(activeDragId)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
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
