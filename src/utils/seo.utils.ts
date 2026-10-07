import { siteConfig } from '@/config/site';

/**
 * Calculates estimated reading time for a given content string
 * Standard reading speed: 200 words per minute
 */
export function calculateReadingTime(content: string): string {
  if (!content) return '1 min read';
  const cleanText = content.replace(/<[^>]*>/g, '');
  const wordCount = cleanText.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return `${minutes} min read`;
}

/**
 * Creates clean text excerpt truncated to specified length
 */
export function generateExcerpt(text: string, maxLength = 160): string {
  if (!text) return '';
  const clean = text.replace(/<[^>]*>/g, '').trim();
  if (clean.length <= maxLength) return clean;
  return clean.substring(0, maxLength).trim() + '...';
}

/**
 * Formats canonical URL
 */
export function buildCanonicalUrl(path: string): string {
  const baseUrl = siteConfig.url.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * Validates slug format
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}
