import { browserAPI } from './api';

export function getExtensionURL(path: string): string {
  return browserAPI.runtime.getURL(path);
}
