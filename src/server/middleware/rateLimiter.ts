interface RateLimitWindow {
  count: number;
  resetAt: number;
}

class RateLimiter {
  private hits = new Map<string, RateLimitWindow>();

  /**
   * Checks if IP exceeds limit within windowMs
   */
  public isRateLimited(key: string, maxRequests = 60, windowMs = 60000): { limited: boolean; remaining: number; resetMs: number } {
    const now = Date.now();
    const window = this.hits.get(key);

    if (!window || window.resetAt <= now) {
      this.hits.set(key, {
        count: 1,
        resetAt: now + windowMs,
      });
      return { limited: false, remaining: maxRequests - 1, resetMs: windowMs };
    }

    window.count += 1;
    if (window.count > maxRequests) {
      return { limited: true, remaining: 0, resetMs: window.resetAt - now };
    }

    return { limited: false, remaining: maxRequests - window.count, resetMs: window.resetAt - now };
  }
}

export const rateLimiter = new RateLimiter();
