import { App } from '../models/App';
import { CustomPage } from '../models/Page';
import { Category } from '../models/Category';
import { Settings } from '../models/Settings';
import { browserAPI } from '../browser/api';
import { migrateData } from './migration';
import { DEFAULT_APPS } from '../data/defaultApps';
import { DEFAULT_CATEGORIES } from '../data/defaultCategories';
import { DEFAULT_PAGES } from '../data/defaultPages';
import { DEFAULT_SETTINGS } from '../models/Settings';

export const CURRENT_SCHEMA_VERSION = 3;

export interface StorageSchema {
  version: number;
  apps: App[];
  pages: CustomPage[];
  categories: Category[];
  settings: Settings;
}

const STORAGE_KEY = 'tvLauncherData';

export async function loadAllData(): Promise<StorageSchema> {
  const result = await browserAPI.storage.local.get([STORAGE_KEY]);
  const data = result[STORAGE_KEY];
  
  if (!data) {
    const initialData = {
      version: CURRENT_SCHEMA_VERSION,
      apps: DEFAULT_APPS,
      categories: DEFAULT_CATEGORIES,
      pages: DEFAULT_PAGES,
      settings: DEFAULT_SETTINGS,
    };
    await saveAllData(initialData);
    return initialData;
  }
  
  return migrateData(data);
}

export async function saveAllData(data: StorageSchema): Promise<void> {
  await browserAPI.storage.local.set({ [STORAGE_KEY]: data });
}

export async function clearAllData(): Promise<StorageSchema> {
  const cleanData: StorageSchema = {
    version: CURRENT_SCHEMA_VERSION,
    apps: [],
    pages: [],
    categories: DEFAULT_CATEGORIES,
    settings: DEFAULT_SETTINGS,
  };
  await browserAPI.storage.local.remove([STORAGE_KEY]);
  await browserAPI.storage.local.set({ [STORAGE_KEY]: cleanData });
  if (typeof localStorage !== 'undefined') {
    localStorage.clear();
  }
  return cleanData;
}
