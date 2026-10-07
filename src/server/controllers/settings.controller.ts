import { settingsService, SettingsService } from '../services/settings.service';
import { settingsValidator } from '../validators/settings.validator';
import { successResponse } from '../api/response';

export class SettingsController {
  constructor(private readonly service: SettingsService = settingsService) {}

  public async getSettings(): Promise<Response> {
    const settings = await this.service.getSettings();
    return successResponse(settings, 'Site settings retrieved successfully');
  }

  public async updateSettings(data: unknown): Promise<Response> {
    const validated = settingsValidator.validatePartial(data);
    const updated = await this.service.updateSettings(validated as any);
    return successResponse(updated, 'Site settings updated successfully');
  }
}

export const settingsController = new SettingsController();
