/**
 * Utility functions for Cloudinary and Media Asset Optimization
 */

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'scale' | 'fit' | 'thumb' | 'crop';
  quality?: 'auto' | 'good' | 'eco' | 'low';
  format?: 'auto' | 'webp' | 'png' | 'jpg';
}

/**
 * Transforms a raw Cloudinary or media URL into an optimized URL with automatic quality and format settings.
 */
export function getOptimizedImageUrl(
  url: string | undefined | null,
  options: ImageOptimizationOptions = {}
): string {
  if (!url) return '/images/placeholder.jpg';

  // If it's already a local path or non-Cloudinary URL, return as-is
  if (!url.includes('res.cloudinary.com')) {
    return url;
  }

  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
  } = options;

  const widthParam = width ? `w_${width},` : '';
  const heightParam = height ? `h_${height},` : '';
  const cropParam = crop ? `c_${crop},` : 'c_fill,';
  const qualityParam = quality ? `q_${quality},` : 'q_auto,';
  const formatParam = format ? `f_${format}` : 'f_auto';

  const transformations = `${cropParam}${widthParam}${heightParam}${qualityParam}${formatParam}`;

  // Insert transformations into Cloudinary URL path
  return url.replace('/upload/', `/upload/${transformations}/`);
}

/**
 * Helper to generate thumbnail URLs for cards and previews
 */
export function getThumbnailUrl(url: string | undefined | null, size = 300): string {
  return getOptimizedImageUrl(url, { width: size, height: size, crop: 'thumb', quality: 'auto' });
}

/**
 * Helper to generate responsive srcSet strings for standard breakpoints
 */
export function getResponsiveSrcSet(url: string | undefined | null): string {
  if (!url || !url.includes('res.cloudinary.com')) return '';

  const breakpoints = [400, 800, 1200];
  return breakpoints
    .map((w) => `${getOptimizedImageUrl(url, { width: w, crop: 'scale' })} ${w}w`)
    .join(', ');
}
