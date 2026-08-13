import React, { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import HomePage from './pages/HomePage';
import CustomPageView from './pages/CustomPageView';
import SettingsPage from './pages/SettingsPage';
import styles from './App.module.css';

function AppContent() {
  const { settings, loading } = useAppContext();

  useEffect(() => {
    // Disable native browser right-click context menu globally across launcher UI
    const handleGlobalContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    window.addEventListener('contextmenu', handleGlobalContextMenu);
    return () => window.removeEventListener('contextmenu', handleGlobalContextMenu);
  }, []);
  
  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }
  
  const { appearance } = settings;
  
  let backgroundStyle: React.CSSProperties = {
    opacity: appearance.backgroundOpacity,
    filter: `blur(${appearance.backgroundBlur}px)`,
    transform: 'scale(1.1)', // To hide blurred edges
  };
  
  if (appearance.backgroundType === 'image' && appearance.backgroundImage) {
    backgroundStyle.backgroundImage = `url(${appearance.backgroundImage})`;
    backgroundStyle.backgroundSize = 'cover';
    backgroundStyle.backgroundPosition = 'center';
  } else if (appearance.backgroundType === 'solid' || appearance.backgroundType === 'gradient') {
    backgroundStyle.background = appearance.background;
  }
  
  return (
    <div
      className={styles.app}
      data-theme={appearance.theme}
    >
      <div className={styles.background} style={backgroundStyle} />
      <div className={styles.vignette} />
      <div className={styles.content}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/page/:pageId" element={<CustomPageView />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </HashRouter>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
