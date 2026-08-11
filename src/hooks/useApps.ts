import { useAppContext } from '../context/AppContext';
import { App } from '../models/App';

export function useApps() {
  const { apps, addApp, updateApp, deleteApp, reorderApps, categories } = useAppContext();
  
  const getAppsByCategory = (categoryId: string | null): App[] => {
    return apps
      .filter(app => (categoryId === null ? !app.categoryId : app.categoryId === categoryId))
      .sort((a, b) => a.order - b.order);
  };
  
  return { apps, addApp, updateApp, deleteApp, reorderApps, getAppsByCategory };
}
