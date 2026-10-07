import { MongooseBaseRepository } from './MongooseBaseRepository';
import { AcademicsModel, type IAcademicsDocument } from '../models/Academics.model';
import type { DetailedSemester } from '@/data/academicsData';

export class AcademicsRepository extends MongooseBaseRepository<DetailedSemester & { id: string }, IAcademicsDocument> {
  constructor() {
    super(AcademicsModel);
  }

  public async find(filter: Record<string, unknown> = {}): Promise<(DetailedSemester & { id: string })[]> {
    const query = { isDeleted: { $ne: true }, ...filter };
    const docs = await this.model.find(query).sort({ semesterNumber: 1, createdAt: 1 }).lean().exec();
    return docs.map((doc) => this.toDomain(doc as unknown as IAcademicsDocument) as DetailedSemester & { id: string });
  }

  public async findBySlug(slug: string): Promise<(DetailedSemester & { id: string }) | null> {
    return this.findOne({ slug });
  }

  public async findBySemesterNumber(semesterNumber: number): Promise<(DetailedSemester & { id: string }) | null> {
    return this.findOne({ semesterNumber });
  }
}

export const academicsRepository = new AcademicsRepository();
