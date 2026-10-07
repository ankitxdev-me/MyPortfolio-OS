import { BaseService } from '../base/BaseService';
import { academicsRepository, AcademicsRepository } from '../db/repositories/AcademicsRepository';
import type { DetailedSemester } from '@/data/academicsData';
import { slugify } from '../utils/slug';
import { logger } from '../logger/logger';

export class AcademicsService extends BaseService<DetailedSemester & { id: string }> {
  constructor(repository: AcademicsRepository = academicsRepository) {
    super(repository);
  }

  public async createSemester(data: Partial<DetailedSemester>): Promise<DetailedSemester & { id: string }> {
    const rawData = data as Record<string, unknown>;
    const semesterNum = Number(rawData.semesterNumber) || (data.title?.match(/\d+/)?.[0] ? Number(data.title.match(/\d+/)?.[0]) : 1);
    const title = data.title || `Semester ${semesterNum}`;
    const baseSlug = slugify(title);
    let slug = baseSlug;

    const existing = await (this.repository as AcademicsRepository).findBySlug(slug);
    if (existing) {
      slug = `${baseSlug}-${Date.now().toString(36)}`;
    }

    const payload = {
      ...data,
      semesterNumber: semesterNum,
      title,
      slug,
      sgpa: data.sgpa || 0,
      credits: data.credits || 20,
      status: data.status || 'Completed',
      published: data.published !== false,
      featured: !!data.featured,
    };

    logger.info(`AcademicsService: Creating semester record [${title}] (Sem #${semesterNum})`);
    return this.create(payload as Partial<DetailedSemester & { id: string }>);
  }

  public async publishSemester(id: string): Promise<DetailedSemester & { id: string }> {
    return this.update(id, { status: 'Completed', published: true } as any);
  }

  public async archiveSemester(id: string): Promise<DetailedSemester & { id: string }> {
    return this.update(id, { status: 'Draft', published: false } as any);
  }

  public async getSummary(includeDrafts = false): Promise<{ overallGpa: number; totalCredits: number; completedSemesters: number }> {
    const filter = includeDrafts ? {} : { published: { $ne: false }, status: { $nin: ['Draft', 'draft', 'Planned'] } };
    const list = await this.getAll(filter);
    const count = list.length;
    const totalSgpa = list.reduce((acc, s) => acc + (s.sgpa || 0), 0);
    const overallGpa = count > 0 ? Number((totalSgpa / count).toFixed(2)) : 8.9;
    const totalCredits = list.reduce((acc, s) => acc + (s.credits || 24), 0) || 160;
    return { overallGpa, totalCredits, completedSemesters: count };
  }
}

export const academicsService = new AcademicsService();
