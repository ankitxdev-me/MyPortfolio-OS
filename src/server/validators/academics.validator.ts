import { z } from 'zod';
import { BaseValidator } from '../base/BaseValidator';

export const createAcademicsSchema = z.object({
  semesterNumber: z.number().min(1).max(20).optional().default(1),
  semesterName: z.string().optional(),
  title: z.string().min(1).optional(),
  term: z.string().optional().default('Spring 2026'),
  year: z.number().optional().default(2026),
  institution: z.string().optional().default('State Technological University'),
  degree: z.string().optional().default('B.Tech Computer Science'),
  duration: z.string().optional().default('6 Months'),
  sgpa: z.number().min(0).max(10).optional().default(9.0),
  gpa: z.number().min(0).max(10).optional().default(9.0),
  cgpaToDate: z.number().min(0).max(10).optional().default(9.0),
  credits: z.number().min(0).optional().default(20),
  status: z.enum(['Completed', 'In Progress', 'Upcoming', 'Draft', 'Planned']).default('Completed'),
  published: z.boolean().optional().default(true),
  featured: z.boolean().optional().default(false),
  summary: z.string().optional().default(''),
  courses: z.array(z.any()).optional().default([]),
  subjects: z.array(z.object({ code: z.string(), name: z.string(), credits: z.number().optional().default(4), grade: z.string().optional().default('A+'), keyTopics: z.array(z.string()).optional().default([]), keyLearning: z.string().optional().default('') })).optional().default([]),
  keyAchievements: z.array(z.string()).optional().default([]),
});

export const updateAcademicsSchema = createAcademicsSchema.partial();

export class AcademicsValidator extends BaseValidator<z.infer<typeof createAcademicsSchema>> {
  protected schema = createAcademicsSchema;
}

export const academicsValidator = new AcademicsValidator();
