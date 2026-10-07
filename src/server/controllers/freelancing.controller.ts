import { BaseController } from '../base/BaseController';
import { freelancingService, FreelancingService } from '../services/freelancing.service';
import type { DetailedClientWork } from '@/data/freelanceData';
import { freelancingValidator } from '../validators/freelancing.validator';
import { successResponse } from '../api/response';

export class FreelancingController extends BaseController<DetailedClientWork & { id: string }> {
  constructor(service: FreelancingService = freelancingService) {
    super(service);
  }

  public async create(data: unknown): Promise<Response> {
    const validated = freelancingValidator.validate(data);
    const created = await (this.service as FreelancingService).createClientWork(validated as unknown as Partial<DetailedClientWork>);
    return successResponse(created, 'Freelancing client work created successfully', undefined, 201);
  }

  public async updateClientWork(id: string, data: unknown): Promise<Response> {
    const validated = freelancingValidator.validatePartial(data);
    const updated = await this.service.update(id, validated as unknown as Partial<DetailedClientWork & { id: string }>);
    return successResponse(updated, 'Freelancing client work updated successfully');
  }
}

export const freelancingController = new FreelancingController();
