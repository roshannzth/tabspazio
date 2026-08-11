import { useAppContext } from '../context/AppContext';

export function useCategories() {
  const { categories, addCategory, updateCategory, deleteCategory, reorderCategories } = useAppContext();
  return { categories, addCategory, updateCategory, deleteCategory, reorderCategories };
}
