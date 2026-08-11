import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { openInNewTab } from '../browser/tabs';
import { AppGrid } from '../components/launcher/AppGrid';
import { App } from '../models/App';
import { EditAppDialog } from '../components/dialogs/EditAppDialog';

export default function CustomPageView() {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();
  const { pages, apps, settings, deleteApp } = useAppContext();
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingApp, setEditingApp] = useState<App | null>(null);

  const page = pages.find(p => p.id === pageId);
  const pageApps = useMemo(() => {
    if (!page) return [];
    return apps.filter(a => page.apps.includes(a.id)).sort((a, b) => a.order - b.order);
  }, [page, apps]);

  const rows = useMemo(() => {
    if (pageApps.length === 0) return [];
    const cols = settings.launcher.columns || 6;
    const r: string[][] = [];
    for (let i = 0; i < pageApps.length; i += cols) {
      r.push(pageApps.slice(i, i + cols).map(a => a.id));
    }
    return r;
  }, [pageApps, settings.launcher.columns]);

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
    onBack: () => navigate('/'),
    enabled: !editingApp
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

  if (!page) {
    return (
      <div style={{ padding: '40px', color: '#fff' }}>
        <h2>Page not found</h2>
        <button onClick={() => navigate('/')} style={{ background: 'transparent', color: '#fff', border: '1px solid #fff', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', marginTop: '20px' }}>
          ← Back to Home
        </button>
      </div>
    );
  }

  // Create a dummy category for the page's apps since AppGrid expects categories
  const dummyCategory = { id: 'page-apps', name: '', order: 0 };
  const mappedApps = pageApps.map(a => ({ ...a, categoryId: 'page-apps' }));

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
        <button 
          onClick={() => navigate('/')} 
          style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', marginRight: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <span>←</span> Back
        </button>
        <h1 style={{ color: '#fff', margin: 0, fontSize: '2rem', fontWeight: 600 }}>{page.name}</h1>
      </div>
      
      <AppGrid
        apps={mappedApps}
        categories={[dummyCategory]}
        focusedId={focusedId}
        onFocusApp={setFocusedId}
        onClickApp={handleAppClick}
        onEditApp={handleEditApp}
        onDeleteApp={handleDeleteApp}
        isEditMode={isEditMode}
        showCategoryLabels={false}
        showAddButton={false}
      />

      {/* Floating Action Button for Edit Mode */}
      <div style={{ position: 'fixed', bottom: '30px', right: '30px', display: 'flex', gap: '15px' }}>
        <button 
          onClick={() => setIsEditMode(!isEditMode)}
          style={{ width: '50px', height: '50px', borderRadius: '50%', background: isEditMode ? 'var(--accent, #0066ff)' : 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title="Edit Mode"
        >
          ✎
        </button>
      </div>

      {editingApp && <EditAppDialog app={editingApp} onClose={() => setEditingApp(null)} />}
    </div>
  );
}
