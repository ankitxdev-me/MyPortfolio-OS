import { MongooseBaseRepository } from './MongooseBaseRepository';
import { SettingsModel, type ISettingsDocument } from '../models/Settings.model';
import type { SiteSettings } from '@/data/settingsData';

export class SettingsRepository extends MongooseBaseRepository<SiteSettings & { id: string }, ISettingsDocument> {
  constructor() {
    super(SettingsModel);
  }

  public async getGlobalSettings(): Promise<(SiteSettings & { id: string }) | null> {
    return this.findOne({ key: 'global_site_settings' });
  }

  public async updateGlobalSettings(data: Partial<SiteSettings>): Promise<(SiteSettings & { id: string }) | null> {
    const updated = await this.model
      .findOneAndUpdate(
        { key: 'global_site_settings' },
        { $set: { ...data, key: 'global_site_settings' } },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
      )
      .lean()
      .exec();
    return this.toDomain(updated as unknown as ISettingsDocument);
  }
}

export const settingsRepository = new SettingsRepository();
