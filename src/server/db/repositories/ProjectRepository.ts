import { MongooseBaseRepository } from './MongooseBaseRepository';
import { ProjectModel, type IProjectDocument } from '../models/Project.model';
import type { DetailedProject } from '@/data/projectsData';

export class ProjectRepository extends MongooseBaseRepository<DetailedProject & { id: string }, IProjectDocument> {
  constructor() {
    super(ProjectModel);
  }

  public async findBySlug(slug: string): Promise<(DetailedProject & { id: string }) | null> {
    return this.findOne({ slug });
  }

  public async findFeatured(): Promise<(DetailedProject & { id: string })[]> {
    return this.find({ featured: true });
  }

  public async findByCategory(category: string): Promise<(DetailedProject & { id: string })[]> {
    return this.find({ category });
  }
}

export const projectRepository = new ProjectRepository();
