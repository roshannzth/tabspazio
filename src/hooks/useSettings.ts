import { useAppContext } from '../context/AppContext';

export function useSettings() {
  const { settings, updateSettings } = useAppContext();
  return { settings, updateSettings };
}
