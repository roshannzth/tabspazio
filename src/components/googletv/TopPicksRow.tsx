import React from 'react';
import { openInNewTab } from '../../browser/tabs';
import { FeedItem } from '../../services/feedService';
import styles from './TopPicksRow.module.css';

const DEFAULT_TOP_PICKS: FeedItem[] = [
  {
    id: 'disney-plus',
    provider: 'Disney+',
    title: 'X-Men \'97',
    meta: 'Disney+',
    description: 'Animation | Action & Adventure',
    backdropUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop',
    url: 'https://www.disneyplus.com',
    badge: 'Disney+',
  },
  {
    id: 'bbc-tourist',
    provider: 'BBC iPlayer',
    title: 'The Tourist',
    meta: 'BBC iPlayer',
    description: 'Mystery & Thriller',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
    url: 'https://www.bbc.co.uk/iplayer',
    badge: 'BBC iPlayer',
  },
  {
    id: 'apple-tv-masters',
    provider: 'Apple TV+',
    title: 'Masters of the Air',
    meta: 'Apple TV+',
    description: 'Drama & History',
    backdropUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop',
    url: 'https://tv.apple.com',
    badge: 'Apple TV+',
  },
  {
    id: 'paramount-mission',
    provider: 'Paramount+',
    title: 'Mission: Impossible',
    meta: 'Paramount+',
    description: 'Action & Adventure',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop',
    url: 'https://www.paramountplus.com',
    badge: 'Paramount+',
  },
];

interface TopPicksRowProps {
  focusedId: string | null;
  onFocusItem: (id: string) => void;
  items?: FeedItem[];
}

export const TopPicksRow: React.FC<TopPicksRowProps> = ({ focusedId, onFocusItem, items }) => {
  const displayItems = items && items.length > 0 ? items : DEFAULT_TOP_PICKS;

  return (
    <section className={styles.section}>
      <h2 className={styles.rowTitle}>Top picks for you</h2>
      
      <div className={styles.rowGrid}>
        {displayItems.map((item) => {
          const isFocused = focusedId === `pick-${item.id}`;
          return (
            <div
              key={item.id}
              tabIndex={0}
              role="button"
              className={`${styles.card} ${isFocused ? styles.focused : ''}`}
              onClick={() => openInNewTab(item.url)}
              onMouseEnter={() => onFocusItem(`pick-${item.id}`)}
              onFocus={() => onFocusItem(`pick-${item.id}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openInNewTab(item.url);
                }
              }}
            >
              <div 
                className={styles.cardBg}
                style={{ backgroundImage: `url(${item.backdropUrl})` }}
              />
              <div className={styles.overlay} />
              
              <div className={styles.badge}>{item.badge || item.provider}</div>
              <div className={styles.cardTitle}>{item.title}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
