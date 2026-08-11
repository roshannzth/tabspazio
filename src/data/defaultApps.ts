import { App } from '../models/App';

export const DEFAULT_APPS: App[] = [
  // Streaming category
  { id: 'netflix', name: 'Netflix', type: 'website', url: 'https://www.netflix.com', categoryId: 'streaming', order: 0, background: '#E50914' },
  { id: 'jiohotstar', name: 'JioHotstar', type: 'website', url: 'https://www.hotstar.com', categoryId: 'streaming', order: 1, background: '#032366' },
  { id: 'youtube', name: 'YouTube', type: 'website', url: 'https://www.youtube.com', categoryId: 'streaming', order: 2, background: '#FF0000' },
  { id: 'prime-video', name: 'Prime Video', type: 'website', url: 'https://www.primevideo.com', categoryId: 'streaming', order: 3, background: '#00A8E1' },
  { id: 'sony-liv', name: 'Sony LIV', type: 'website', url: 'https://www.sonyliv.com', categoryId: 'streaming', order: 4, background: '#FFC800' },
  { id: 'spotify', name: 'Spotify', type: 'website', url: 'https://open.spotify.com', categoryId: 'streaming', order: 5, background: '#1DB954' },
  { id: 'plex', name: 'Plex', type: 'website', url: 'https://app.plex.tv', categoryId: 'streaming', order: 6, background: '#E5A00D' },
  
  // Work category
  { id: 'github', name: 'GitHub', type: 'website', url: 'https://github.com', categoryId: 'work', order: 0, background: '#24292e' },
  { id: 'gmail', name: 'Gmail', type: 'website', url: 'https://mail.google.com', categoryId: 'work', order: 1, background: '#D44638' },
  { id: 'aws-console', name: 'AWS Console', type: 'website', url: 'https://console.aws.amazon.com', categoryId: 'work', order: 2, background: '#FF9900' },
  { id: 'jira', name: 'Jira', type: 'website', url: 'https://www.atlassian.com/software/jira', categoryId: 'work', order: 3, background: '#0052CC' },
  
  // Games category
  { id: 'steam', name: 'Steam', type: 'website', url: 'https://store.steampowered.com', categoryId: 'games', order: 0, background: '#171A21' },
  { id: 'epic-games', name: 'Epic Games', type: 'website', url: 'https://store.epicgames.com', categoryId: 'games', order: 1, background: '#121212' },
  { id: 'xbox', name: 'Xbox', type: 'website', url: 'https://www.xbox.com', categoryId: 'games', order: 2, background: '#107C10' },
];
