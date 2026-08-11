import { StorageSchema } from './storage';
import { DEFAULT_APPS } from '../data/defaultApps';
import { DEFAULT_CATEGORIES } from '../data/defaultCategories';
import { DEFAULT_PAGES } from '../data/defaultPages';
import { DEFAULT_SETTINGS } from '../models/Settings';

export function migrateData(data: any): StorageSchema {
  const version = data?.version || 1;
  
  if (version === 1) {
    return {
      version: 1,
      apps: Array.isArray(data?.apps) ? data.apps : DEFAULT_APPS,
      pages: Array.isArray(data?.pages) ? data.pages : DEFAULT_PAGES,
      categories: Array.isArray(data?.categories) ? data.categories : DEFAULT_CATEGORIES,
      settings: data?.settings ? { ...DEFAULT_SETTINGS, ...data.settings } : DEFAULT_SETTINGS,
    };
  }
  
  // Future migrations can be added here
  
  return data as StorageSchema;
}
