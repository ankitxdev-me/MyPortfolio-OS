import { z } from 'zod';
import { BaseValidator } from '../base/BaseValidator';

export const createLearningSchema = z.object({
  name: z.string().optional(),
  title: z.string().optional(),
  platform: z.string().optional().default('Self-Paced'),
  instructor: z.string().optional().default('Lead Architect'),
  category: z.string().optional().default('General'),
  proficiency: z.number().min(0).max(100).optional().default(50),
  progressPercent: z.number().min(0).max(100).optional().default(50),
  iconName: z.string().optional().default('Code2'),
  description: z.string().optional().default(''),
  status: z.string().optional().default('in_progress'),
  published: z.boolean().optional().default(true),
  featured: z.boolean().optional().default(false),
  isTopSkill: z.boolean().optional().default(false),
  topics: z.array(z.string()).optional().default([]),
  timeline: z.array(
    z.object({
      date: z.string().optional().default(''),
      title: z.string().optional().default(''),
      description: z.string().optional().default(''),
    })
  ).optional().default([]),
  startDate: z.string().optional().default(''),
  targetCompletion: z.string().optional().default(''),
  startedDate: z.string().optional().default(''),
  completedDate: z.string().optional().default(''),
  certificateUrl: z.string().optional().default(''),
  credentialId: z.string().optional().default(''),
  hoursSpent: z.number().min(0).optional().default(0),
  keyTakeaways: z.array(z.string()).optional().default([]),
  architectureNotes: z.string().optional().default(''),
  recommendedResources: z.array(z.any()).optional().default([]),
});

export const updateLearningSchema = createLearningSchema.partial();

export class LearningValidator extends BaseValidator<z.infer<typeof createLearningSchema>> {
  protected schema = createLearningSchema;
}

export const learningValidator = new LearningValidator();
