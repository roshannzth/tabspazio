import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { openInNewTab } from '../browser/tabs';
import { Clock } from '../components/launcher/Clock';
import { AppGrid } from '../components/launcher/AppGrid';
import { AddAppDialog } from '../components/dialogs/AddAppDialog';
import { AddPageDialog } from '../components/dialogs/AddPageDialog';
import { AddCategoryDialog } from '../components/dialogs/AddCategoryDialog';
import { EditAppDialog } from '../components/dialogs/EditAppDialog';
import { App } from '../models/App';

export default function HomePage() {
  const { apps, categories, settings, deleteApp } = useAppContext();
  const navigate = useNavigate();
  
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Dialog states
  const [showAddApp, setShowAddApp] = useState(false);
  const [showAddPage, setShowAddPage] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingApp, setEditingApp] = useState<App | null>(null);

  // Build rows for keyboard navigation
  const rows = useMemo(() => {
    const r: string[][] = [];
    categories.forEach(cat => {
      const catApps = apps.filter(a => a.categoryId === cat.id).sort((a, b) => a.order - b.order);
      if (catApps.length > 0) {
        r.push(catApps.map(a => a.id));
      }
    });
    return r;
  }, [apps, categories]);

  const handleSelect = (appId: string) => {
    const app = apps.find(a => a.id === appId);
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
    enabled: !showAddApp && !showAddPage && !showAddCategory && !editingApp
  });

  const handleAppClick = (app: App) => {
    if (isEditMode) {
      setEditingApp(app);
    } else {
      handleSelect(app.id);
    }
  };

  const handleEditApp = (app: App) => {
    setEditingApp(app);
  };

  const handleDeleteApp = (app: App) => {
    if (window.confirm(`Delete ${app.name}?`)) {
      deleteApp(app.id);
    }
  };

  return (
    <div style={{ padding: '40px' }}>
      <Clock />
      
      <div style={{ marginTop: '40px' }}>
        <AppGrid
          apps={apps}
          categories={categories}
          focusedId={focusedId}
          onFocusApp={setFocusedId}
          onClickApp={handleAppClick}
          onEditApp={handleEditApp}
          onDeleteApp={handleDeleteApp}
          isEditMode={isEditMode}
          showCategoryLabels={settings.launcher.showCategoryLabels}
          showAddButton={isEditMode}
          onAddApp={() => setShowAddApp(true)}
        />
      </div>

      {/* Floating Action Buttons */}
      <div style={{ position: 'fixed', bottom: '30px', right: '30px', display: 'flex', gap: '15px' }}>
        <button 
          onClick={() => setShowAddCategory(true)}
          style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title="Add Category"
        >
          📂
        </button>
        <button 
          onClick={() => setShowAddPage(true)}
          style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title="Add Page"
        >
          📄
        </button>
        <button 
          onClick={() => setShowAddApp(true)}
          style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title="Add App"
        >
          +
        </button>
        <button 
          onClick={() => setIsEditMode(!isEditMode)}
          style={{ width: '50px', height: '50px', borderRadius: '50%', background: isEditMode ? 'var(--accent, #0066ff)' : 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title="Edit Mode"
        >
          ✎
        </button>
        <button 
          onClick={() => navigate('/settings')}
          style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title="Settings"
        >
          ⚙
        </button>
      </div>

      {showAddApp && <AddAppDialog onClose={() => setShowAddApp(false)} />}
      {showAddPage && <AddPageDialog onClose={() => setShowAddPage(false)} />}
      {showAddCategory && <AddCategoryDialog onClose={() => setShowAddCategory(false)} />}
      {editingApp && <EditAppDialog app={editingApp} onClose={() => setEditingApp(null)} />}
    </div>
  );
}
