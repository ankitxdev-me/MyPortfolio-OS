import { BaseController } from '../base/BaseController';
import { journeyService, JourneyService } from '../services/journey.service';
import type { DetailedMilestone } from '@/data/journeyData';
import { journeyValidator } from '../validators/journey.validator';
import { successResponse } from '../api/response';

export class JourneyController extends BaseController<DetailedMilestone & { id: string }> {
  constructor(service: JourneyService = journeyService) {
    super(service);
  }

  public async create(data: unknown): Promise<Response> {
    const validated = journeyValidator.validate(data);
    const created = await (this.service as JourneyService).createMilestone(validated as unknown as Partial<DetailedMilestone>);
    return successResponse(created, 'Milestone created successfully', undefined, 201);
  }

  public async updateMilestone(id: string, data: unknown): Promise<Response> {
    const validated = journeyValidator.validatePartial(data);
    const updated = await this.service.update(id, validated as unknown as Partial<DetailedMilestone & { id: string }>);
    return successResponse(updated, 'Milestone updated successfully');
  }

  public async duplicate(id: string): Promise<Response> {
    const duplicated = await (this.service as JourneyService).duplicateMilestone(id);
    return successResponse(duplicated, 'Milestone duplicated successfully', undefined, 201);
  }
}

export const journeyController = new JourneyController();
