import { BaseController } from '../base/BaseController';
import { academicsService, AcademicsService } from '../services/academics.service';
import type { DetailedSemester } from '@/data/academicsData';
import { academicsValidator } from '../validators/academics.validator';
import { successResponse } from '../api/response';

export class AcademicsController extends BaseController<DetailedSemester & { id: string }> {
  constructor(service: AcademicsService = academicsService) {
    super(service);
  }

  public async create(data: unknown): Promise<Response> {
    const validated = academicsValidator.validate(data);
    const created = await (this.service as AcademicsService).createSemester(validated as unknown as Partial<DetailedSemester>);
    return successResponse(created, 'Academic semester record created successfully', undefined, 201);
  }

  public async updateSemester(id: string, data: unknown): Promise<Response> {
    const validated = academicsValidator.validatePartial(data);
    const updated = await this.service.update(id, validated as unknown as Partial<DetailedSemester & { id: string }>);
    return successResponse(updated, 'Academic semester record updated successfully');
  }

  public async getSummary(includeDrafts = false): Promise<Response> {
    const summary = await (this.service as AcademicsService).getSummary(includeDrafts);
    return successResponse(summary, 'Academic summary retrieved successfully');
  }
}

export const academicsController = new AcademicsController();
