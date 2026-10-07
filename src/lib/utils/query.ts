import type { QueryOptions } from '../types/api.types';

export function buildQueryString(options: QueryOptions = {}): string {
  const searchParams = new URLSearchParams();

  if (options.page !== undefined && options.page !== null) {
    searchParams.append('page', String(options.page));
  }

  if (options.limit !== undefined && options.limit !== null) {
    searchParams.append('limit', String(options.limit));
  }

  if (options.sortBy) {
    searchParams.append('sortBy', options.sortBy);
  }

  if (options.sortOrder) {
    searchParams.append('sortOrder', options.sortOrder);
  }

  if (options.search) {
    searchParams.append('search', options.search.trim());
  }

  if (options.filter && typeof options.filter === 'object') {
    Object.entries(options.filter).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        if (Array.isArray(val)) {
          val.forEach((item) => searchParams.append(key, String(item)));
        } else {
          searchParams.append(key, String(val));
        }
      }
    });
  }

  // Handle any additional top-level query fields
  Object.entries(options).forEach(([key, val]) => {
    if (
      !['page', 'limit', 'sortBy', 'sortOrder', 'search', 'filter'].includes(key) &&
      val !== undefined &&
      val !== null &&
      val !== ''
    ) {
      searchParams.append(key, String(val));
    }
  });

  const queryStr = searchParams.toString();
  return queryStr ? `?${queryStr}` : '';
}
