export interface App {
  id: string;
  name: string;
  type: 'website' | 'page';
  url?: string;
  pageId?: string;
  icon?: string;
  background?: string;
  categoryId?: string;
  order: number;
  isFavorite?: boolean;
}
