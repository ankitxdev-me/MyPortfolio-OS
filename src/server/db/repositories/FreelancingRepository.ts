import { MongooseBaseRepository } from './MongooseBaseRepository';
import { FreelancingModel, type IFreelancingDocument } from '../models/Freelancing.model';
import type { DetailedClientWork } from '@/data/freelanceData';

export class FreelancingRepository extends MongooseBaseRepository<DetailedClientWork & { id: string }, IFreelancingDocument> {
  constructor() {
    super(FreelancingModel);
  }

  public async findBySlug(slug: string): Promise<(DetailedClientWork & { id: string }) | null> {
    return this.findOne({ slug });
  }

  public async findByClient(clientName: string): Promise<(DetailedClientWork & { id: string })[]> {
    return this.find({ clientName });
  }
}

export const freelancingRepository = new FreelancingRepository();
