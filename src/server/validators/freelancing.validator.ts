import { z } from 'zod';
import { BaseValidator } from '../base/BaseValidator';

export const createFreelancingSchema = z.object({
  title: z.string().min(3),
  clientName: z.string().min(2),
  industry: z.string().min(2),
  projectType: z.string().min(2),
  duration: z.string().min(2),
  status: z.enum(['Completed', 'In Progress', 'On Hold', 'Draft', 'Planned']).default('Completed'),
  published: z.boolean().optional().default(true),
  featured: z.boolean().optional().default(false),
  techStack: z.array(z.string()).default([]),
  description: z.string().min(10),
  objectives: z.array(z.string()).optional().default([]),
  deliverables: z.array(z.string()).optional().default([]),
  challenges: z.array(z.object({ problem: z.string(), solution: z.string(), outcome: z.string() })).optional().default([]),
  businessImpact: z.array(z.object({ metric: z.string(), label: z.string() })).optional().default([]),
  testimonial: z.object({ id: z.string(), clientName: z.string(), role: z.string(), company: z.string(), projectTitle: z.string(), rating: z.number(), feedback: z.string() }).optional(),
});

export const updateFreelancingSchema = createFreelancingSchema.partial();

export class FreelancingValidator extends BaseValidator<z.infer<typeof createFreelancingSchema>> {
  protected schema = createFreelancingSchema;
}

export const freelancingValidator = new FreelancingValidator();
