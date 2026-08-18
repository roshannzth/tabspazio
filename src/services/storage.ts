import { App } from '../models/App';
import { Settings, DEFAULT_SETTINGS } from '../models/Settings';
import { browserAPI } from '../browser/api';
import { migrateData } from './migration';
import { DEFAULT_APPS } from '../data/defaultApps';

export const CURRENT_SCHEMA_VERSION = 3;

export interface StorageSchema {
  version: number;
  apps: App[];
  settings: Settings;
  pages?: any[];
  categories?: any[];
}

const STORAGE_KEY = 'tabspazioData';
const LEGACY_STORAGE_KEY = 'tvLauncherData';

export async function loadAllData(): Promise<StorageSchema> {
  const result = await browserAPI.storage.local.get([STORAGE_KEY, LEGACY_STORAGE_KEY]);
  const data = result[STORAGE_KEY] || result[LEGACY_STORAGE_KEY];
  
  if (!data) {
    const initialData: StorageSchema = {
      version: CURRENT_SCHEMA_VERSION,
      apps: DEFAULT_APPS,
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
    settings: DEFAULT_SETTINGS,
  };
  await browserAPI.storage.local.remove([STORAGE_KEY, LEGACY_STORAGE_KEY]);
  await browserAPI.storage.local.set({ [STORAGE_KEY]: cleanData });
  if (typeof localStorage !== 'undefined') {
    localStorage.clear();
  }
  return cleanData;
}
