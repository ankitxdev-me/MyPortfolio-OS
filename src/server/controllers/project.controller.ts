import { BaseController } from '../base/BaseController';
import { projectService, ProjectService } from '../services/project.service';
import type { DetailedProject } from '@/data/projectsData';
import { projectValidator } from '../validators/project.validator';
import { successResponse } from '../api/response';

export class ProjectController extends BaseController<DetailedProject & { id: string }> {
  constructor(service: ProjectService = projectService) {
    super(service);
  }

  public async create(data: unknown): Promise<Response> {
    const validated = projectValidator.validate(data);
    const created = await (this.service as ProjectService).createProject(validated as unknown as Partial<DetailedProject>);
    return successResponse(created, 'Project created successfully', undefined, 201);
  }

  public async updateProject(id: string, data: unknown): Promise<Response> {
    const validated = projectValidator.validatePartial(data);
    const updated = await this.service.update(id, validated as unknown as Partial<DetailedProject & { id: string }>);
    return successResponse(updated, 'Project updated successfully');
  }

  public async publish(id: string): Promise<Response> {
    const published = await (this.service as ProjectService).publishProject(id);
    return successResponse(published, 'Project published successfully');
  }

  public async archive(id: string): Promise<Response> {
    const archived = await (this.service as ProjectService).archiveProject(id);
    return successResponse(archived, 'Project archived successfully');
  }

  public async duplicate(id: string): Promise<Response> {
    const duplicated = await (this.service as ProjectService).duplicateProject(id);
    return successResponse(duplicated, 'Project duplicated successfully', undefined, 201);
  }
}

export const projectController = new ProjectController();
