import { BaseController } from '../base/BaseController';
import { blogService, BlogService } from '../services/blog.service';
import type { DetailedBlog } from '@/data/blogsData';
import { blogValidator } from '../validators/blog.validator';
import { successResponse } from '../api/response';

export class BlogController extends BaseController<DetailedBlog & { id: string }> {
  constructor(service: BlogService = blogService) {
    super(service);
  }

  public async create(data: unknown): Promise<Response> {
    const validated = blogValidator.validate(data);
    const created = await (this.service as BlogService).createArticle(validated as unknown as Partial<DetailedBlog>);
    return successResponse(created, 'Blog article created successfully', undefined, 201);
  }

  public async updateArticle(id: string, data: unknown): Promise<Response> {
    const validated = blogValidator.validatePartial(data);
    const updated = await this.service.update(id, validated as unknown as Partial<DetailedBlog & { id: string }>);
    return successResponse(updated, 'Blog article updated successfully');
  }

  public async publish(id: string): Promise<Response> {
    const published = await (this.service as BlogService).publishArticle(id);
    return successResponse(published, 'Blog article published successfully');
  }

  public async archive(id: string): Promise<Response> {
    const archived = await (this.service as BlogService).archiveArticle(id);
    return successResponse(archived, 'Blog article archived successfully');
  }

  public async duplicate(id: string): Promise<Response> {
    const duplicated = await (this.service as BlogService).duplicateArticle(id);
    return successResponse(duplicated, 'Blog article duplicated successfully', undefined, 201);
  }
}

export const blogController = new BlogController();
