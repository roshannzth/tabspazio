import React, { useState, useEffect } from 'react';
import { App } from '../../models/App';
import { FeedItem } from '../../services/feedService';
import styles from './HeroSpotlight.module.css';

const DEFAULT_SPOTLIGHTS: FeedItem[] = [
  {
    id: 'oppenheimer',
    provider: 'YouTube',
    title: 'Oppenheimer',
    meta: 'Trending | Christopher Nolan\'s magnificent global phenomenon about the father of the atomic bomb',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    backdropUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1920&auto=format&fit=crop',
    url: 'https://www.youtube.com',
    badge: 'YouTube',
  },
  {
    id: 'stranger-things',
    provider: 'Netflix',
    title: 'Stranger Things',
    meta: 'Top 10 Today | Sci-Fi & Fantasy',
    description: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop',
    url: 'https://www.netflix.com',
    badge: 'Netflix',
  },
  {
    id: 'rings-of-power',
    provider: 'Prime Video',
    title: 'The Lord of the Rings',
    meta: 'Featured Series | Epic Fantasy',
    description: 'Beginning in a time of relative peace, we follow an ensemble cast of characters as they confront the re-emergence of evil to Middle-earth.',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1920&auto=format&fit=crop',
    url: 'https://www.primevideo.com',
    badge: 'Prime Video',
  },
];

interface HeroSpotlightProps {
  focusedApp?: App | null;
  items?: FeedItem[];
}

export const HeroSpotlight: React.FC<HeroSpotlightProps> = ({ focusedApp, items }) => {
  const spotlightItems = items && items.length > 0 ? items : DEFAULT_SPOTLIGHTS;
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto rotate every 8 seconds if no app focused
  useEffect(() => {
    if (focusedApp) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % spotlightItems.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [focusedApp, spotlightItems.length]);

  // Determine current display content
  let displayItem = spotlightItems[currentIndex % spotlightItems.length];

  if (focusedApp) {
    displayItem = {
      id: focusedApp.id,
      provider: focusedApp.name,
      title: focusedApp.name,
      meta: focusedApp.url ? `Web Application | ${focusedApp.url}` : 'Custom Application',
      description: `Launch ${focusedApp.name} directly on your big screen browser experience.`,
      backdropUrl: focusedApp.background || displayItem.backdropUrl,
      url: focusedApp.url || '#',
      badge: focusedApp.name,
    };
  }

  return (
    <section className={styles.heroContainer}>
      <div 
        className={styles.backdropImage}
        style={{ 
          backgroundImage: displayItem.backdropUrl.startsWith('#') || displayItem.backdropUrl.startsWith('linear') 
            ? displayItem.backdropUrl 
            : `url(${displayItem.backdropUrl})` 
        }}
      />
      <div className={styles.gradientOverlay} />

      <div className={styles.content}>
        <div className={styles.providerBadge}>
          <span className={styles.playIcon}>▶</span> {displayItem.provider}
        </div>
        <h1 className={styles.title}>{displayItem.title}</h1>
        <p className={styles.meta}>{displayItem.meta}</p>
        <p className={styles.description}>{displayItem.description}</p>

        <div className={styles.paginationDots}>
          {spotlightItems.map((_, idx) => (
            <span
              key={idx}
              className={`${styles.dot} ${idx === currentIndex ? styles.activeDot : ''}`}
              onClick={() => setCurrentIndex(idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
