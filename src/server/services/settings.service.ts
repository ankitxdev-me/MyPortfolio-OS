import { settingsRepository, SettingsRepository } from '../db/repositories/SettingsRepository';
import { SITE_SETTINGS, type SiteSettings } from '@/data/settingsData';
import { logger } from '../logger/logger';
import { inMemoryCache } from '../cache/inMemoryCache';

export class SettingsService {
  constructor(private readonly repository: SettingsRepository = settingsRepository) {}

  public async getSettings(): Promise<SiteSettings & { id: string }> {
    return inMemoryCache.getOrSet('global_site_settings', async () => {
      const settings = await this.repository.getGlobalSettings();
      if (!settings) {
        return {
          id: 'global_site_settings',
          ...SITE_SETTINGS,
        };
      }
      return settings;
    }, 300000); // 5 minute TTL
  }

  public async updateSettings(data: Partial<SiteSettings> & Record<string, any>): Promise<SiteSettings & { id: string }> {
    logger.info('SettingsService: Updating global site settings');
    const normalized: Partial<SiteSettings> = { ...data };
    if (data.name && !data.authorName) normalized.authorName = data.name;
    if (data.title && !data.authorRole) normalized.authorRole = data.title;
    if (data.bio && !data.authorBio) normalized.authorBio = data.bio;
    if (data.avatar && !data.authorAvatar) normalized.authorAvatar = data.avatar;
    if (data.availabilityStatus && !data.currentStatus) normalized.currentStatus = data.availabilityStatus;

    const updated = await this.repository.updateGlobalSettings(normalized);
    inMemoryCache.invalidate('global_site_settings');
    inMemoryCache.invalidatePrefix('github_stats_');
    return updated || (await this.getSettings());
  }
}

export const settingsService = new SettingsService();
