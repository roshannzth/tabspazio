import { browserAPI } from '../browser/api';

export interface FeedItem {
  id: string;
  provider: string;
  title: string;
  meta: string;
  description: string;
  backdropUrl: string;
  url: string;
  badge?: string;
}

const CACHE_KEY = 'tv_launcher_feed_cache';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes cache

const FALLBACK_FEEDS: FeedItem[] = [
  {
    id: 'oppenheimer',
    provider: 'YouTube',
    title: 'Oppenheimer',
    meta: 'Trending | Christopher Nolan\'s global phenomenon',
    description: 'The story of J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    backdropUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1920&auto=format&fit=crop',
    url: 'https://www.youtube.com/results?search_query=oppenheimer+trailer',
    badge: 'YouTube',
  },
  {
    id: 'stranger-things',
    provider: 'Netflix',
    title: 'Stranger Things',
    meta: 'Top 10 Today | Sci-Fi & Mystery',
    description: 'A small town uncovers a mystery involving secret experiments and terrifying supernatural forces.',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop',
    url: 'https://www.netflix.com',
    badge: 'Netflix',
  },
  {
    id: 'rings-of-power',
    provider: 'Prime Video',
    title: 'The Lord of the Rings',
    meta: 'Featured Series | Epic Fantasy',
    description: 'An ensemble cast confronts the re-emergence of evil in Middle-earth.',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1920&auto=format&fit=crop',
    url: 'https://www.primevideo.com',
    badge: 'Prime Video',
  },
  {
    id: 'xmen-97',
    provider: 'Disney+',
    title: 'X-Men \'97',
    meta: 'Animation | Action & Adventure',
    description: 'A band of mutants use their uncanny gifts to protect a world that hates and fears them.',
    backdropUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1920&auto=format&fit=crop',
    url: 'https://www.disneyplus.com',
    badge: 'Disney+',
  },
];

interface CacheStructure {
  timestamp: number;
  items: FeedItem[];
}

/**
 * Live fetches trending entertainment & news feeds without requiring API keys.
 * Uses public JSON APIs (Reddit Movies/Trending, HackerNews) with fallbacks.
 */
export async function fetchLiveTrendingFeed(): Promise<FeedItem[]> {
  try {
    // 1. Check local storage cache
    const cacheData = await browserAPI.storage.local.get(CACHE_KEY);
    const cached = cacheData[CACHE_KEY] as CacheStructure | undefined;

    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS && cached.items?.length > 0) {
      return cached.items;
    }

    // 2. Fetch live items from Reddit Trending Movies / Entertainment
    const res = await fetch('https://www.reddit.com/r/movies/hot.json?limit=6', {
      headers: { 'User-Agent': 'TVLauncherAddon/1.0' },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();
    const posts = json?.data?.children || [];

    const liveItems: FeedItem[] = [];

    posts.forEach((p: any, idx: number) => {
      const data = p.data;
      if (!data || data.stickied || !data.title) return;

      // Extract image URL if available
      let imageUrl = FALLBACK_FEEDS[idx % FALLBACK_FEEDS.length].backdropUrl;

      if (data.preview?.images?.[0]?.source?.url) {
        imageUrl = data.preview.images[0].source.url.replace(/&amp;/g, '&');
      } else if (data.thumbnail && data.thumbnail.startsWith('http')) {
        imageUrl = data.thumbnail;
      }

      liveItems.push({
        id: data.id || `reddit-${idx}`,
        provider: data.subreddit_name_prefixed || 'Reddit Movies',
        title: data.title.length > 70 ? data.title.substring(0, 67) + '...' : data.title,
        meta: `Trending in ${data.subreddit_name_prefixed} | ${data.score} upvotes`,
        description: data.selftext ? data.selftext.substring(0, 140) + '...' : `Posted by u/${data.author}`,
        backdropUrl: imageUrl,
        url: `https://www.reddit.com${data.permalink}`,
        badge: 'Reddit',
      });
    });

    const finalItems = liveItems.length > 0 ? liveItems : FALLBACK_FEEDS;

    // Save to cache
    await browserAPI.storage.local.set({
      [CACHE_KEY]: {
        timestamp: Date.now(),
        items: finalItems,
      },
    });

    return finalItems;
  } catch (error) {
    console.warn('Using fallback feed due to fetch error:', error);
    return FALLBACK_FEEDS;
  }
}
