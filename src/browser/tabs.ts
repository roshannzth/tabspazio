import { browserAPI } from './api';

export async function openInNewTab(url: string): Promise<void> {
  await browserAPI.tabs.create({ url, active: true });
}
