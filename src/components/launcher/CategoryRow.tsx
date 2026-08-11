import React, { useEffect, useRef } from 'react';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { App } from '../../models/App';
import { Category } from '../../models/Category';
import { AppCard } from './AppCard';
import styles from './CategoryRow.module.css';

interface CategoryRowProps {
  category: Category | null;
  apps: App[];
  focusedId: string | null;
  onFocusApp: (id: string) => void;
  onClickApp: (app: App) => void;
  onEditApp?: (app: App) => void;
  onDeleteApp?: (app: App) => void;
  isEditMode?: boolean;
  showLabel?: boolean;
}

function SortableAppCard({ app, focusedId, onFocusApp, onClickApp, isEditMode, onEditApp, onDeleteApp }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: app.id });
  const cardRef = useRef<HTMLDivElement>(null);
  const isFocused = focusedId === app.id;

  useEffect(() => {
    if (isFocused && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [isFocused]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : (isFocused ? 10 : 1),
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div ref={cardRef}>
        <AppCard
          app={app}
          isFocused={isFocused}
          onFocus={() => onFocusApp(app.id)}
          onClick={() => onClickApp(app)}
          isEditMode={isEditMode}
          onEdit={onEditApp ? () => onEditApp(app) : undefined}
          onDelete={onDeleteApp ? () => onDeleteApp(app) : undefined}
        />
      </div>
    </div>
  );
}

export function CategoryRow({
  category,
  apps,
  focusedId,
  onFocusApp,
  onClickApp,
  onEditApp,
  onDeleteApp,
  isEditMode,
  showLabel = true,
}: CategoryRowProps) {
  if (apps.length === 0 && !isEditMode) return null;

  return (
    <div className={styles.container}>
      {showLabel && category && <div className={styles.label}>{category.name}</div>}
      <div className={styles.row}>
        <SortableContext items={apps.map(a => a.id)}>
          {apps.map((app) => (
            <SortableAppCard
              key={app.id}
              app={app}
              focusedId={focusedId}
              onFocusApp={onFocusApp}
              onClickApp={onClickApp}
              isEditMode={isEditMode}
              onEditApp={onEditApp}
              onDeleteApp={onDeleteApp}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
