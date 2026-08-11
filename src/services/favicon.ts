export function getFaviconUrl(siteUrl: string, size?: number): string {
  try {
    const url = new URL(siteUrl);
    return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=${size || 64}`;
  } catch (e) {
    return '';
  }
}

export function getInitials(name: string): string {
  if (!name) return '';
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return (words[0][0] + words[1][0]).toUpperCase();
}

export function getColorFromString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;
  return `hsl(${h}, 70%, 50%)`;
}
