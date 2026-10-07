import { MongooseBaseRepository } from './MongooseBaseRepository';
import { BlogModel, type IBlogDocument } from '../models/Blog.model';
import type { DetailedBlog } from '@/data/blogsData';

export class BlogRepository extends MongooseBaseRepository<DetailedBlog & { id: string }, IBlogDocument> {
  constructor() {
    super(BlogModel);
  }

  public async findBySlug(slug: string): Promise<(DetailedBlog & { id: string }) | null> {
    return this.findOne({ slug });
  }

  public async findFeatured(): Promise<(DetailedBlog & { id: string })[]> {
    return this.find({ featured: true, status: 'published' });
  }

  public async findByCategory(category: string): Promise<(DetailedBlog & { id: string })[]> {
    return this.find({ category, status: 'published' });
  }
}

export const blogRepository = new BlogRepository();
