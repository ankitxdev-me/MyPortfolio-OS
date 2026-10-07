import { MongooseBaseRepository } from './MongooseBaseRepository';
import { JourneyModel, type IJourneyDocument } from '../models/Journey.model';
import type { DetailedMilestone } from '@/data/journeyData';

export class JourneyRepository extends MongooseBaseRepository<DetailedMilestone & { id: string }, IJourneyDocument> {
  constructor() {
    super(JourneyModel);
  }

  public override async find(filter: Record<string, unknown> = {}): Promise<(DetailedMilestone & { id: string })[]> {
    const query = { isDeleted: { $ne: true }, ...filter };
    const docs = await this.model.find(query).sort({ year: 1, createdAt: 1 }).lean().exec();
    return docs.map((doc) => this.toDomain(doc as unknown as IJourneyDocument) as DetailedMilestone & { id: string });
  }

  public async findBySlug(slug: string): Promise<(DetailedMilestone & { id: string }) | null> {
    return this.findOne({ slug });
  }

  public async findByYear(year: string): Promise<(DetailedMilestone & { id: string })[]> {
    return this.find({ year });
  }
}

export const journeyRepository = new JourneyRepository();
