export interface App {
  id: string;
  name: string;
  type: 'website';
  url: string;
  icon?: string;
  background?: string;
  order: number;
  isFavorite?: boolean;
}
