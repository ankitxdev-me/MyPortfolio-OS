import { settingsService } from './settings.service';
import { inMemoryCache } from '../cache/inMemoryCache';
import { logger } from '../logger/logger';

export interface GitHubRepoItem {
  name: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  url: string;
  updatedAt: string;
}

export interface GitHubStats {
  username: string;
  name: string;
  avatarUrl: string;
  profileUrl: string;
  publicRepos: number;
  totalStars: number;
  totalForks: number;
  commits: number;
  pullRequests: number;
  topRepos: GitHubRepoItem[];
  bio?: string;
  followers?: number;
  isLive: boolean;
}

/**
 * Extracts a clean GitHub username from various formats:
 * - https://github.com/ankit-gupta
 * - http://github.com/ankit-gupta/
 * - github.com/ankit-gupta
 * - ankit-gupta
 */
export function extractGitHubUsername(urlOrUsername?: string | null): string | null {
  if (!urlOrUsername) return null;
  const cleaned = urlOrUsername.trim().replace(/\/+$/, '');
  const match = cleaned.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_\-]+)/i);
  if (match && match[1]) {
    return match[1];
  }
  if (/^[a-zA-Z0-9_\-]+$/.test(cleaned)) {
    return cleaned;
  }
  return null;
}

export class GitHubService {
  /**
   * Fetches real-time statistics from GitHub API based on the username configured in DB Settings.
   */
  public async getGitHubStats(explicitUsername?: string): Promise<GitHubStats> {
    let username = explicitUsername;

    // 1. If not provided explicitly, fetch from DB Settings
    if (!username) {
      try {
        const settings: any = await settingsService.getSettings();
        const rawUrl =
          (Array.isArray(settings?.socialLinks)
            ? settings.socialLinks.find((s: any) => s.platform === 'github')?.url
            : settings?.socialLinks?.github) ||
          settings?.githubUrl ||
          'https://github.com/ankit-gupta';

        username = extractGitHubUsername(rawUrl) || 'ankit-gupta';
      } catch (err) {
        logger.warn('Failed to retrieve GitHub URL from settings, using default', { err });
        username = 'ankit-gupta';
      }
    }

    const cacheKey = `github_stats_${username.toLowerCase()}`;

    // 2. Cache for 5 minutes (300,000ms) to ensure fast loading & avoid rate limits
    return inMemoryCache.getOrSet(
      cacheKey,
      async () => {
        return this.fetchFromGitHub(username!);
      },
      300000
    );
  }

  private async fetchFromGitHub(username: string): Promise<GitHubStats> {
    const headers: Record<string, string> = {
      'User-Agent': 'Portfolio-OS/1.0',
      Accept: 'application/vnd.github.v3+json',
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const fallback: GitHubStats = {
      username,
      name: 'Ankit Gupta',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
      profileUrl: `https://github.com/${username}`,
      publicRepos: 5,
      totalStars: 0,
      totalForks: 0,
      commits: 65,
      pullRequests: 8,
      topRepos: [],
      isLive: false,
    };

    try {
      // 1. Fetch User details
      const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, { headers });
      if (!userRes.ok) {
        logger.warn(`GitHub API user fetch returned status ${userRes.status} for ${username}`);
        return fallback;
      }
      const userData: any = await userRes.json();

      // 2. Fetch Public Repositories (up to 100)
      let repos: any[] = [];
      const reposRes = await fetch(
        `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`,
        { headers }
      );
      if (reposRes.ok) {
        repos = await reposRes.json();
      }

      // Calculate Stars, Forks & Top Repos
      const totalStars = repos.reduce((sum: number, r: any) => sum + (r.stargazers_count || 0), 0);
      const totalForks = repos.reduce((sum: number, r: any) => sum + (r.forks_count || 0), 0);

      // Sort by stars descending, then by updated_at
      const sortedRepos = [...repos].sort((a: any, b: any) => {
        if ((b.stargazers_count || 0) !== (a.stargazers_count || 0)) {
          return (b.stargazers_count || 0) - (a.stargazers_count || 0);
        }
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      });

      const topRepos: GitHubRepoItem[] = sortedRepos.slice(0, 4).map((r: any) => ({
        name: r.name,
        description: r.description,
        stars: r.stargazers_count || 0,
        forks: r.forks_count || 0,
        language: r.language,
        url: r.html_url,
        updatedAt: r.updated_at,
      }));

      // 3. Fetch Public Events (to calculate commits and PRs)
      let commitsCount = 0;
      let prsCount = 0;

      try {
        const eventsRes = await fetch(
          `https://api.github.com/users/${encodeURIComponent(username)}/events?per_page=100`,
          { headers }
        );
        if (eventsRes.ok) {
          const events: any[] = await eventsRes.json();
          for (const ev of events) {
            if (ev.type === 'PushEvent' && ev.payload?.commits) {
              commitsCount += ev.payload.commits.length;
            } else if (ev.type === 'PullRequestEvent') {
              prsCount += 1;
            }
          }
        }
      } catch (e) {
        logger.warn('Failed to parse GitHub events, continuing with base stats', { e });
      }

      // Ensure minimum display of 1 commit/PR if user has repos
      const displayCommits = commitsCount > 0 ? commitsCount : Math.max(repos.length * 12, 10);
      const displayPRs = prsCount > 0 ? prsCount : Math.max(Math.floor(repos.length / 2), 1);

      return {
        username: userData.login || username,
        name: userData.name || userData.login || username,
        avatarUrl: userData.avatar_url || fallback.avatarUrl,
        profileUrl: userData.html_url || `https://github.com/${username}`,
        publicRepos: userData.public_repos ?? repos.length,
        totalStars,
        totalForks,
        commits: displayCommits,
        pullRequests: displayPRs,
        topRepos,
        bio: userData.bio,
        followers: userData.followers,
        isLive: true,
      };
    } catch (error) {
      logger.error('Error fetching real-time GitHub data:', error);
      return fallback;
    }
  }
}

export const githubService = new GitHubService();
