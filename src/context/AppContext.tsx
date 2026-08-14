import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { App } from '../models/App';
import { Settings, DEFAULT_SETTINGS } from '../models/Settings';
import { loadAllData, saveAllData, clearAllData, StorageSchema, CURRENT_SCHEMA_VERSION } from '../services/storage';
import { exportConfiguration, importConfiguration } from '../services/importExport';

declare const chrome: any;

export interface AppContextType {
  apps: App[];
  settings: Settings;
  loading: boolean;
  addApp: (app: Omit<App, 'id' | 'order'>) => Promise<void>;
  updateApp: (id: string, updates: Partial<App>) => Promise<void>;
  deleteApp: (id: string) => Promise<void>;
  reorderApps: (appIds: string[]) => Promise<void>;
  updateSettings: (settings: Partial<Settings>) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  resetAllData: () => Promise<void>;
  exportConfig: () => Promise<void>;
  importConfig: (file: File) => Promise<{ success: boolean; error?: string }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [apps, setApps] = useState<App[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshData = async () => {
    const data = await loadAllData();
    setApps(data.apps || []);
    setSettings(data.settings || DEFAULT_SETTINGS);
    setLoading(false);
  };

  useEffect(() => {
    refreshData();

    // Listen for storage changes across multiple open tabs in real-time
    const handleStorageChange = () => {
      refreshData();
    };

    if (typeof chrome !== 'undefined' && chrome.storage?.onChanged) {
      chrome.storage.onChanged.addListener(handleStorageChange);
      return () => chrome.storage.onChanged.removeListener(handleStorageChange);
    } else {
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, []);

  const saveState = async (newState: Partial<StorageSchema>) => {
    const dataToSave: StorageSchema = {
      version: CURRENT_SCHEMA_VERSION,
      apps: newState.apps || apps,
      settings: newState.settings || settings,
    };
    await saveAllData(dataToSave);
  };

  const addApp = async (app: Omit<App, 'id' | 'order'>) => {
    const order = apps.length > 0 ? Math.max(...apps.map(a => a.order)) + 1 : 0;
    const newApp: App = { ...app, id: crypto.randomUUID(), order };
    const newApps = [...apps, newApp];
    setApps(newApps);
    await saveState({ apps: newApps });
  };

  const updateApp = async (id: string, updates: Partial<App>) => {
    const newApps = apps.map(app => app.id === id ? { ...app, ...updates } : app);
    setApps(newApps);
    await saveState({ apps: newApps });
  };

  const deleteApp = async (id: string) => {
    const newApps = apps.filter(app => app.id !== id);
    setApps(newApps);
    await saveState({ apps: newApps });
  };

  const reorderApps = async (appIds: string[]) => {
    const reorderedApps = appIds.map((id, index) => {
      const app = apps.find(a => a.id === id)!;
      return { ...app, order: index };
    });
    setApps(reorderedApps);
    await saveState({ apps: reorderedApps });
  };

  const updateSettings = async (updates: Partial<Settings>) => {
    const newSettings: Settings = {
      ...settings,
      ...updates,
      clock: { ...settings.clock, ...(updates.clock || {}) },
      appearance: { ...settings.appearance, ...(updates.appearance || {}) },
      weather: { ...(settings.weather || DEFAULT_SETTINGS.weather), ...(updates.weather || {}) },
    };
    setSettings(newSettings);
    await saveState({ settings: newSettings });
  };

  const toggleFavorite = async (id: string) => {
    const newApps = apps.map(app => app.id === id ? { ...app, isFavorite: app.isFavorite === false ? true : false } : app);
    setApps(newApps);
    await saveState({ apps: newApps });
  };

  const resetAllData = async () => {
    const cleanData = await clearAllData();
    setApps(cleanData.apps);
    setSettings(cleanData.settings);
  };

  const exportConfig = async () => {
    const data: StorageSchema = { version: CURRENT_SCHEMA_VERSION, apps, settings };
    exportConfiguration(data);
  };

  const importConfig = async (file: File) => {
    const result = await importConfiguration(file);
    if (result.success && result.data) {
      setApps(result.data.apps || []);
      setSettings(result.data.settings || DEFAULT_SETTINGS);
      await saveAllData(result.data);
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  return (
    <AppContext.Provider value={{
      apps, settings, loading,
      addApp, updateApp, deleteApp, reorderApps,
      updateSettings, toggleFavorite, resetAllData, exportConfig, importConfig
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
