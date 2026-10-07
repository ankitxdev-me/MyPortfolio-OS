import { z } from 'zod';
import { BaseValidator } from '../base/BaseValidator';

export const createBlogSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  subtitle: z.string().optional().default(''),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
  content: z.record(z.unknown()).or(z.string()),
  coverImage: z.string().min(1, 'Cover image URL is required'),
  date: z.string().optional().default(new Date().toISOString()),
  readTime: z.string().default('5 min read'),
  category: z.enum(['Engineering', 'Backend', 'Web Dev', 'AI / ML', 'DevOps']).default('Engineering'),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  author: z.object({
    name: z.string().default('Ankit Gupta'),
    role: z.string().default('Lead Engineer'),
    avatar: z.string().default('/images/avatar-admin.png'),
    bio: z.string().default('Full-stack software engineer.'),
  }).default({ name: 'Ankit Gupta', role: 'Lead Engineer', avatar: '/images/avatar-admin.png', bio: 'Full-stack software engineer.' }),
  toc: z.array(z.object({ id: z.string(), title: z.string(), level: z.number() })).optional().default([]),
  seo: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    ogImage: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  }).optional(),
  status: z.enum(['published', 'draft', 'archived']).default('published'),
});

export const updateBlogSchema = createBlogSchema.partial();

export class BlogValidator extends BaseValidator<z.infer<typeof createBlogSchema>> {
  protected schema = createBlogSchema;
}

export const blogValidator = new BlogValidator();
