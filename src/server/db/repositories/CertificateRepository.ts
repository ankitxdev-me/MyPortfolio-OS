import { MongooseBaseRepository } from './MongooseBaseRepository';
import { CertificateModel, type ICertificateDocument } from '../models/Certificate.model';
import type { CertificateDTO } from '@/lib/types/api.types';

export class CertificateRepository extends MongooseBaseRepository<CertificateDTO, ICertificateDocument> {
  constructor() {
    super(CertificateModel);
  }

  public async findBySlug(slug: string): Promise<CertificateDTO | null> {
    return this.findOne({ slug });
  }
}

export const certificateRepository = new CertificateRepository();
