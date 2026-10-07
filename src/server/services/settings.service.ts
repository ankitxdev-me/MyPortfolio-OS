import { settingsRepository, SettingsRepository } from '../db/repositories/SettingsRepository';
import { SITE_SETTINGS, type SiteSettings } from '@/data/settingsData';
import { logger } from '../logger/logger';
import { inMemoryCache } from '../cache/inMemoryCache';

export class SettingsService {
  constructor(private readonly repository: SettingsRepository = settingsRepository) {}

  public async getSettings(): Promise<SiteSettings & { id: string }> {
    return inMemoryCache.getOrSet('global_site_settings', async () => {
      const settings = await this.repository.getGlobalSettings();
      const base = settings || {
        id: 'global_site_settings',
        ...SITE_SETTINGS,
      };

      // Ensure social links are consistently populated in both the array and the top-level URL fields
      const res = { ...base };
      const links = Array.isArray(res.socialLinks) ? [...res.socialLinks] : [];

      const getUrl = (platform: string, fallback?: string) => {
        const found = links.find((l: any) => l.platform === platform || l.platform?.toLowerCase() === platform);
        return found?.url || fallback || '';
      };

      res.githubUrl = getUrl('github', res.githubUrl || SITE_SETTINGS.githubUrl);
      res.linkedinUrl = getUrl('linkedin', res.linkedinUrl || SITE_SETTINGS.linkedinUrl);
      res.twitterUrl = getUrl('twitter', res.twitterUrl || SITE_SETTINGS.twitterUrl);
      res.leetcodeUrl = getUrl('leetcode', res.leetcodeUrl || SITE_SETTINGS.leetcodeUrl);
      res.googleCloudUrl = getUrl('googlecloud', res.googleCloudUrl || SITE_SETTINGS.googleCloudUrl);

      // Reconstruct consistent socialLinks array with latest URLs
      res.socialLinks = [
        { platform: 'github', url: res.githubUrl, icon: 'Github', label: 'GitHub' },
        { platform: 'linkedin', url: res.linkedinUrl, icon: 'Linkedin', label: 'LinkedIn' },
        { platform: 'leetcode', url: res.leetcodeUrl, icon: 'Code', label: 'LeetCode' },
        { platform: 'googlecloud', url: res.googleCloudUrl, icon: 'Cloud', label: 'Google Cloud' },
        { platform: 'twitter', url: res.twitterUrl, icon: 'Twitter', label: 'Twitter' },
      ];

      return res as SiteSettings & { id: string };
    }, 5000); // 5s short TTL to avoid serving stale data across serverless lambdas
  }

  public async updateSettings(data: Partial<SiteSettings> & Record<string, any>): Promise<SiteSettings & { id: string }> {
    logger.info('SettingsService: Updating global site settings');
    const normalized: Partial<SiteSettings> & Record<string, any> = { ...data };

    if (data.name && !data.authorName) normalized.authorName = data.name;
    if (data.title && !data.authorRole) normalized.authorRole = data.title;
    if (data.bio && !data.authorBio) normalized.authorBio = data.bio;
    if (data.avatar && !data.authorAvatar) normalized.authorAvatar = data.avatar;
    if (data.availabilityStatus && !data.currentStatus) normalized.currentStatus = data.availabilityStatus;

    // Synchronize social URLs from array to top-level fields
    if (Array.isArray(normalized.socialLinks)) {
      for (const item of normalized.socialLinks) {
        if (!item || !item.url) continue;
        const p = item.platform?.toLowerCase();
        if (p === 'github') normalized.githubUrl = item.url;
        if (p === 'linkedin') normalized.linkedinUrl = item.url;
        if (p === 'twitter') normalized.twitterUrl = item.url;
        if (p === 'leetcode') normalized.leetcodeUrl = item.url;
        if (p === 'googlecloud' || p === 'google_cloud' || p === 'gcp') normalized.googleCloudUrl = item.url;
      }
    }

    // And vice-versa: ensure socialLinks array reflects any top-level URL fields passed
    const githubUrl = normalized.githubUrl ?? data.githubUrl;
    const linkedinUrl = normalized.linkedinUrl ?? data.linkedinUrl;
    const twitterUrl = normalized.twitterUrl ?? data.twitterUrl;
    const leetcodeUrl = normalized.leetcodeUrl ?? data.leetcodeUrl;
    const googleCloudUrl = normalized.googleCloudUrl ?? data.googleCloudUrl;

    if (githubUrl || linkedinUrl || twitterUrl || leetcodeUrl || googleCloudUrl) {
      normalized.socialLinks = [
        { platform: 'github', url: githubUrl || '', icon: 'Github', label: 'GitHub' },
        { platform: 'linkedin', url: linkedinUrl || '', icon: 'Linkedin', label: 'LinkedIn' },
        { platform: 'leetcode', url: leetcodeUrl || '', icon: 'Code', label: 'LeetCode' },
        { platform: 'googlecloud', url: googleCloudUrl || '', icon: 'Cloud', label: 'Google Cloud' },
        { platform: 'twitter', url: twitterUrl || '', icon: 'Twitter', label: 'Twitter' },
      ];
    }

    const updated = await this.repository.updateGlobalSettings(normalized);
    inMemoryCache.invalidate('global_site_settings');
    inMemoryCache.invalidatePrefix('github_stats_');
    return updated || (await this.getSettings());
  }
}

export const settingsService = new SettingsService();
