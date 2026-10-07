import { z } from 'zod';
import { BaseValidator } from '../base/BaseValidator';

export const createJourneySchema = z.object({
  year: z.string().min(4),
  quarter: z.string().default('Q1'),
  title: z.string().min(3),
  category: z.enum(['Milestone', 'Career', 'Education', 'Open Source', 'Project Launch']),
  summary: z.string().min(5),
  description: z.string().min(10),
  iconName: z.string().default('Flag'),
  impactMetrics: z.array(z.object({ label: z.string(), value: z.string() })).optional().default([]),
  keyLearnings: z.array(z.string()).optional().default([]),
});

export const updateJourneySchema = createJourneySchema.partial();

export class JourneyValidator extends BaseValidator<z.infer<typeof createJourneySchema>> {
  protected schema = createJourneySchema;
}

export const journeyValidator = new JourneyValidator();
