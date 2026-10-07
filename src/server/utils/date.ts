export function toIsoString(date: Date | string | number): string {
  return new Date(date).toISOString();
}

export function formatDate(date: Date | string | number, locale = 'en-US'): string {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getRelativeTimeString(date: Date | string | number): string {
  const timeMs = new Date(date).getTime();
  const deltaSeconds = Math.floor((Date.now() - timeMs) / 1000);

  if (deltaSeconds < 60) return 'just now';
  if (deltaSeconds < 3600) return `${Math.floor(deltaSeconds / 60)} minutes ago`;
  if (deltaSeconds < 86400) return `${Math.floor(deltaSeconds / 3600)} hours ago`;
  return `${Math.floor(deltaSeconds / 86400)} days ago`;
}
