import { BaseController } from '../base/BaseController';
import { learningService, LearningService } from '../services/learning.service';
import type { TechnologyDetail } from '@/data/learningData';
import { learningValidator } from '../validators/learning.validator';
import { successResponse } from '../api/response';

export class LearningController extends BaseController<TechnologyDetail & { id: string }> {
  constructor(service: LearningService = learningService) {
    super(service);
  }

  public async create(data: unknown): Promise<Response> {
    const validated = learningValidator.validate(data);
    const created = await (this.service as LearningService).createTopic(validated as unknown as Partial<TechnologyDetail>);
    return successResponse(created, 'Learning topic created successfully', undefined, 201);
  }

  public async updateTopic(id: string, data: unknown): Promise<Response> {
    const validated = learningValidator.validatePartial(data);
    const updated = await this.service.update(id, validated as unknown as Partial<TechnologyDetail & { id: string }>);
    return successResponse(updated, 'Learning topic updated successfully');
  }

  public async duplicate(id: string): Promise<Response> {
    const duplicated = await (this.service as LearningService).duplicateTopic(id);
    return successResponse(duplicated, 'Learning topic duplicated successfully', undefined, 201);
  }
}

export const learningController = new LearningController();
