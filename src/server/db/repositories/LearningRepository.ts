import { MongooseBaseRepository } from './MongooseBaseRepository';
import { LearningModel, type ILearningDocument } from '../models/Learning.model';
import type { TechnologyDetail } from '@/data/learningData';

export class LearningRepository extends MongooseBaseRepository<TechnologyDetail & { id: string }, ILearningDocument> {
  constructor() {
    super(LearningModel);
  }

  public async findBySlug(slug: string): Promise<(TechnologyDetail & { id: string }) | null> {
    return this.findOne({ slug });
  }

  public async findByCategory(category: string): Promise<(TechnologyDetail & { id: string })[]> {
    return this.find({ category });
  }
}

export const learningRepository = new LearningRepository();
