interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class InMemoryCache {
  private cache = new Map<string, CacheEntry<any>>();

  /**
   * Retrieves item from cache or executes fetcher function and caches result for ttlMs
   */
  public async getOrSet<T>(key: string, fetcher: () => Promise<T>, ttlMs = 60000): Promise<T> {
    const now = Date.now();
    const existing = this.cache.get(key);

    if (existing && existing.expiresAt > now) {
      return existing.value as T;
    }

    const value = await fetcher();
    this.cache.set(key, {
      value,
      expiresAt: now + ttlMs,
    });

    return value;
  }

  /**
   * Invalidates specific cache key
   */
  public invalidate(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Invalidates cache keys starting with prefix
   */
  public invalidatePrefix(prefix: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clears entire in-memory cache
   */
  public clear(): void {
    this.cache.clear();
  }
}

export const inMemoryCache = new InMemoryCache();
