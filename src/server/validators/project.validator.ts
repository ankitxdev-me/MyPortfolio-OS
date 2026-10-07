import { z } from 'zod';
import { BaseValidator } from '../base/BaseValidator';

export const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional().default(''),
  category: z.string().optional().default('Web Development'),
  description: z.string().optional().default(''),
  summary: z.string().optional().default(''),
  status: z.string().optional().default('In Progress'),
  progress: z.number().min(0).max(100).default(0),
  featured: z.boolean().default(false),
  published: z.boolean().optional().default(true),
  startDate: z.string().optional().default(''),
  deadline: z.string().optional().default(''),
  githubUrl: z.string().optional().default(''),
  liveUrl: z.string().optional().default(''),
  demoUrl: z.string().optional().default(''),
  image: z.string().optional().default('/images/projects/autoops.jpg'),
  thumbnailUrl: z.string().optional().default('/images/projects/autoops.jpg'),
  gallery: z.array(z.any()).optional().default([]),
  metrics: z.array(z.any()).optional().default([]),
  techStack: z.any().optional().default({ frontend: [], backend: [], database: [], infrastructure: [] }),
  overview: z.string().optional().default(''),
  architectureOverview: z.string().optional().default(''),
  features: z.array(z.string()).optional().default([]),
  timeline: z.array(z.any()).optional().default([]),
  challenges: z.array(z.any()).optional().default([]),
  lessonsLearned: z.any().optional().default({ engineering: '', architecture: '', performance: '' }),
});

export const updateProjectSchema = createProjectSchema.partial();

export class ProjectValidator extends BaseValidator<z.infer<typeof createProjectSchema>> {
  protected schema = createProjectSchema;
}

export const projectValidator = new ProjectValidator();
