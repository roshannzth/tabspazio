import { StorageSchema, CURRENT_SCHEMA_VERSION } from './storage';
import { DEFAULT_APPS } from '../data/defaultApps';
import { DEFAULT_CATEGORIES } from '../data/defaultCategories';
import { DEFAULT_PAGES } from '../data/defaultPages';
import { DEFAULT_SETTINGS } from '../models/Settings';

export function migrateData(data: any): StorageSchema {
  const version = data?.version || 1;
  
  if (version < CURRENT_SCHEMA_VERSION) {
    return {
      version: CURRENT_SCHEMA_VERSION,
      apps: DEFAULT_APPS,
      categories: DEFAULT_CATEGORIES,
      pages: DEFAULT_PAGES,
      settings: DEFAULT_SETTINGS,
    };
  }
  
  return data as StorageSchema;
}
