import { StorageSchema, CURRENT_SCHEMA_VERSION } from './storage';
import { DEFAULT_APPS } from '../data/defaultApps';
import { DEFAULT_SETTINGS } from '../models/Settings';

export function migrateData(data: any): StorageSchema {
  const version = data?.version || 1;
  
  if (version < CURRENT_SCHEMA_VERSION) {
    return {
      version: CURRENT_SCHEMA_VERSION,
      apps: data?.apps || DEFAULT_APPS,
      settings: {
        ...DEFAULT_SETTINGS,
        ...(data?.settings || {}),
        clock: { ...DEFAULT_SETTINGS.clock, ...(data?.settings?.clock || {}) },
        appearance: { ...DEFAULT_SETTINGS.appearance, ...(data?.settings?.appearance || {}) },
        weather: { ...DEFAULT_SETTINGS.weather, ...(data?.settings?.weather || {}) },
      },
    };
  }
  
  return {
    ...data,
    version: CURRENT_SCHEMA_VERSION,
    apps: data?.apps || [],
    settings: {
      ...DEFAULT_SETTINGS,
      ...(data?.settings || {}),
      clock: { ...DEFAULT_SETTINGS.clock, ...(data?.settings?.clock || {}) },
      appearance: { ...DEFAULT_SETTINGS.appearance, ...(data?.settings?.appearance || {}) },
      weather: { ...DEFAULT_SETTINGS.weather, ...(data?.settings?.weather || {}) },
    },
  } as StorageSchema;
}
