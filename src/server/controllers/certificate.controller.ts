import { BaseController } from '../base/BaseController';
import { certificateService, CertificateService } from '../services/certificate.service';
import { certificateValidator } from '../validators/certificate.validator';
import type { CertificateDTO } from '@/lib/types/api.types';
import { successResponse } from '../api/response';

export class CertificateController extends BaseController<CertificateDTO> {
  constructor(service: CertificateService = certificateService) {
    super(service);
  }

  public async create(data: unknown): Promise<Response> {
    const validated = certificateValidator.validate(data);
    const created = await (this.service as CertificateService).createCertificate(validated as Partial<CertificateDTO>);
    return successResponse(created, 'Certificate created successfully', undefined, 201);
  }

  public async updateCertificate(id: string, data: unknown): Promise<Response> {
    const validated = certificateValidator.validatePartial(data);
    const updated = await this.service.update(id, validated as Partial<CertificateDTO>);
    return successResponse(updated, 'Certificate updated successfully');
  }
}

export const certificateController = new CertificateController();
