import { CustomPage } from '../models/Page';

export const DEFAULT_PAGES: CustomPage[] = [
  {
    id: 'movies-shows',
    name: 'Movies & Shows',
    icon: '🍿',
    background: '#261338',
    apps: ['netflix', 'jiohotstar', 'youtube', 'prime-video', 'spotify', 'plex'],
    order: 0,
  },
  {
    id: 'gaming',
    name: 'Gaming',
    icon: '🎮',
    background: '#0b3c4d',
    apps: ['steam', 'epic-games', 'xbox'],
    order: 1,
  },
  {
    id: 'work',
    name: 'Work',
    icon: '💼',
    background: '#423315',
    apps: ['github', 'gmail', 'aws-console'],
    order: 2,
  },
  {
    id: 'learning',
    name: 'Learning',
    icon: '🎓',
    background: '#14224c',
    apps: [],
    order: 3,
  },
  {
    id: 'personal',
    name: 'Personal',
    icon: '❤️',
    background: '#3b2318',
    apps: [],
    order: 4,
  },
];
