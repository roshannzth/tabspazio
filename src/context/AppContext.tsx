import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { App } from '../models/App';
import { CustomPage } from '../models/Page';
import { Category } from '../models/Category';
import { Settings, DEFAULT_SETTINGS } from '../models/Settings';
import { loadAllData, saveAllData, clearAllData, StorageSchema, CURRENT_SCHEMA_VERSION } from '../services/storage';
import { exportConfiguration, importConfiguration } from '../services/importExport';

declare const chrome: any;

export interface AppContextType {
  apps: App[];
  pages: CustomPage[];
  categories: Category[];
  settings: Settings;
  loading: boolean;
  addApp: (app: Omit<App, 'id' | 'order'>) => Promise<void>;
  updateApp: (id: string, updates: Partial<App>) => Promise<void>;
  deleteApp: (id: string) => Promise<void>;
  reorderApps: (categoryId: string | null, appIds: string[]) => Promise<void>;
  addPage: (page: Omit<CustomPage, 'order'>) => Promise<void>;
  updatePage: (id: string, updates: Partial<CustomPage>) => Promise<void>;
  deletePage: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id' | 'order'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  reorderCategories: (categoryIds: string[]) => Promise<void>;
  updateSettings: (settings: Partial<Settings>) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  resetAllData: () => Promise<void>;
  exportConfig: () => Promise<void>;
  importConfig: (file: File) => Promise<{ success: boolean; error?: string }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [apps, setApps] = useState<App[]>([]);
  const [pages, setPages] = useState<CustomPage[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshData = async () => {
    const data = await loadAllData();
    setApps(data.apps);
    setPages(data.pages);
    setCategories(data.categories);
    setSettings(data.settings);
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
      pages: newState.pages || pages,
      categories: newState.categories || categories,
      settings: newState.settings || settings,
    };
    await saveAllData(dataToSave);
  };

  const addApp = async (app: Omit<App, 'id' | 'order'>) => {
    const categoryApps = apps.filter(a => a.categoryId === app.categoryId);
    const order = categoryApps.length > 0 ? Math.max(...categoryApps.map(a => a.order)) + 1 : 0;
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

  const reorderApps = async (categoryId: string | null, appIds: string[]) => {
    const otherApps = apps.filter(app => categoryId === null ? app.categoryId : app.categoryId !== categoryId);
    const reorderedApps = appIds.map((id, index) => {
      const app = apps.find(a => a.id === id)!;
      return { ...app, order: index };
    });
    const newApps = [...otherApps, ...reorderedApps];
    setApps(newApps);
    await saveState({ apps: newApps });
  };

  const addPage = async (page: Omit<CustomPage, 'order'>) => {
    const order = pages.length > 0 ? Math.max(...pages.map(p => p.order)) + 1 : 0;
    const newPage: CustomPage = { ...page, id: page.id || crypto.randomUUID(), order };
    const newPages = [...pages, newPage];
    setPages(newPages);
    await saveState({ pages: newPages });
  };

  const updatePage = async (id: string, updates: Partial<CustomPage>) => {
    const newPages = pages.map(page => page.id === id ? { ...page, ...updates } : page);
    setPages(newPages);
    await saveState({ pages: newPages });
  };

  const deletePage = async (id: string) => {
    const newPages = pages.filter(page => page.id !== id);
    setPages(newPages);
    await saveState({ pages: newPages });
  };

  const addCategory = async (category: Omit<Category, 'id' | 'order'>) => {
    const order = categories.length > 0 ? Math.max(...categories.map(c => c.order)) + 1 : 0;
    const newCategory: Category = { ...category, id: crypto.randomUUID(), order };
    const newCategories = [...categories, newCategory];
    setCategories(newCategories);
    await saveState({ categories: newCategories });
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    const newCategories = categories.map(category => category.id === id ? { ...category, ...updates } : category);
    setCategories(newCategories);
    await saveState({ categories: newCategories });
  };

  const deleteCategory = async (id: string) => {
    const newCategories = categories.filter(category => category.id !== id);
    setCategories(newCategories);
    const newApps = apps.map(app => app.categoryId === id ? { ...app, categoryId: undefined } : app);
    setApps(newApps);
    await saveState({ categories: newCategories, apps: newApps });
  };

  const reorderCategories = async (categoryIds: string[]) => {
    const newCategories = categoryIds.map((id, index) => {
      const category = categories.find(c => c.id === id)!;
      return { ...category, order: index };
    });
    setCategories(newCategories);
    await saveState({ categories: newCategories });
  };

  const updateSettings = async (updates: Partial<Settings>) => {
    const newSettings: Settings = {
      ...settings,
      ...updates,
      clock: { ...settings.clock, ...(updates.clock || {}) },
      appearance: { ...settings.appearance, ...(updates.appearance || {}) },
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
    setPages(cleanData.pages);
    setCategories(cleanData.categories);
    setSettings(cleanData.settings);
  };

  const exportConfig = async () => {
    const data: StorageSchema = { version: CURRENT_SCHEMA_VERSION, apps, pages, categories, settings };
    exportConfiguration(data);
  };

  const importConfig = async (file: File) => {
    const result = await importConfiguration(file);
    if (result.success && result.data) {
      setApps(result.data.apps);
      setPages(result.data.pages);
      setCategories(result.data.categories);
      setSettings(result.data.settings);
      await saveAllData(result.data);
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  return (
    <AppContext.Provider value={{
      apps, pages, categories, settings, loading,
      addApp, updateApp, deleteApp, reorderApps,
      addPage, updatePage, deletePage,
      addCategory, updateCategory, deleteCategory, reorderCategories,
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
