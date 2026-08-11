import { browserAPI } from './api';

export async function getStorageItem<T>(key: string, defaultValue: T): Promise<T> {
  const result = await browserAPI.storage.local.get(key);
  return result[key] !== undefined ? result[key] : defaultValue;
}

export async function setStorageItem<T>(key: string, value: T): Promise<void> {
  await browserAPI.storage.local.set({ [key]: value });
}

export async function removeStorageItem(key: string): Promise<void> {
  await browserAPI.storage.local.remove(key);
}
