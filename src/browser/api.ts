// @ts-nocheck
const isDev = typeof chrome === 'undefined' && typeof browser === 'undefined';

const getStorageMethod = () => {
  if (isDev) {
    return {
      local: {
        get: async (keys?: string | string[] | null) => {
          if (keys === null || keys === undefined) {
            const allItems: Record<string, any> = {};
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (key) {
                try {
                  allItems[key] = JSON.parse(localStorage.getItem(key) || 'null');
                } catch {
                  allItems[key] = localStorage.getItem(key);
                }
              }
            }
            return allItems;
          }
          
          if (typeof keys === 'string') {
            keys = [keys];
          }
          
          const result: Record<string, any> = {};
          if (Array.isArray(keys)) {
            for (const key of keys) {
              try {
                result[key] = JSON.parse(localStorage.getItem(key) || 'null');
              } catch {
                result[key] = localStorage.getItem(key);
              }
            }
          } else if (typeof keys === 'object') {
            for (const key in keys) {
              const item = localStorage.getItem(key);
              if (item !== null) {
                try {
                  result[key] = JSON.parse(item);
                } catch {
                  result[key] = item;
                }
              } else {
                result[key] = keys[key];
              }
            }
          }
          return result;
        },
        set: async (items: Record<string, any>) => {
          for (const [key, value] of Object.entries(items)) {
            localStorage.setItem(key, JSON.stringify(value));
          }
        },
        remove: async (keys: string | string[]) => {
          if (typeof keys === 'string') {
            keys = [keys];
          }
          for (const key of keys) {
            localStorage.removeItem(key);
          }
        },
      }
    };
  }

  if (typeof browser !== 'undefined' && browser.storage) {
    return browser.storage;
  }

  // Chromium fallback wrapper
  return {
    local: {
      get: (keys?: string | string[] | null) => {
        return new Promise((resolve) => {
          chrome.storage.local.get(keys, resolve);
        });
      },
      set: (items: Record<string, any>) => {
        return new Promise<void>((resolve) => {
          chrome.storage.local.set(items, () => resolve());
        });
      },
      remove: (keys: string | string[]) => {
        return new Promise<void>((resolve) => {
          chrome.storage.local.remove(keys, () => resolve());
        });
      }
    }
  };
};

const getTabsMethod = () => {
  if (isDev) {
    return {
      create: async (options: { url: string; active?: boolean }) => {
        window.open(options.url, '_blank');
        return {}; // Dummy tab object
      }
    };
  }

  if (typeof browser !== 'undefined' && browser.tabs) {
    return browser.tabs;
  }

  return {
    create: (options: { url: string; active?: boolean }) => {
      return new Promise((resolve) => {
        chrome.tabs.create(options, resolve);
      });
    }
  };
};

const getRuntimeMethod = () => {
  if (isDev) {
    return {
      getURL: (path: string) => {
        return `/${path.replace(/^\//, '')}`;
      },
      get id() {
        return 'dev-extension-id';
      }
    };
  }

  const runtime = typeof browser !== 'undefined' && browser.runtime ? browser.runtime : chrome.runtime;
  return runtime;
};

export const browserAPI = {
  storage: getStorageMethod(),
  tabs: getTabsMethod(),
  runtime: getRuntimeMethod()
};
