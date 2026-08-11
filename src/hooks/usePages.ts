import { useAppContext } from '../context/AppContext';
import { CustomPage } from '../models/Page';

export function usePages() {
  const { pages, addPage, updatePage, deletePage } = useAppContext();
  
  const getPageById = (id: string): CustomPage | undefined => {
    return pages.find(p => p.id === id);
  };
  
  return { pages, addPage, updatePage, deletePage, getPageById };
}
