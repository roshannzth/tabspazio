import { useAppContext } from '../context/AppContext';

export function useApps() {
  const { apps, addApp, updateApp, deleteApp, reorderApps } = useAppContext();
  return { apps, addApp, updateApp, deleteApp, reorderApps };
}
