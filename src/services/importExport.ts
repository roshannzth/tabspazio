import { StorageSchema } from './storage';
import { migrateData } from './migration';

export function exportConfiguration(data: StorageSchema): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tv-launcher-config.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function validateImportData(data: any): { valid: boolean; error?: string } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid configuration format' };
  }
  
  if (data.apps && !Array.isArray(data.apps)) {
    return { valid: false, error: 'Apps must be an array' };
  }
  
  if (data.categories && !Array.isArray(data.categories)) {
    return { valid: false, error: 'Categories must be an array' };
  }
  
  if (data.pages && !Array.isArray(data.pages)) {
    return { valid: false, error: 'Pages must be an array' };
  }
  
  return { valid: true };
}

export async function importConfiguration(file: File): Promise<{ success: boolean; data?: StorageSchema; error?: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        
        const validation = validateImportData(parsed);
        if (!validation.valid) {
          resolve({ success: false, error: validation.error });
          return;
        }
        
        const migrated = migrateData(parsed);
        resolve({ success: true, data: migrated });
      } catch (err) {
        resolve({ success: false, error: 'Failed to parse JSON file' });
      }
    };
    
    reader.onerror = () => {
      resolve({ success: false, error: 'Failed to read file' });
    };
    
    reader.readAsText(file);
  });
}
