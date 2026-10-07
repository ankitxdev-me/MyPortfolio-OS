import { z } from 'zod';
import { BaseValidator } from '../base/BaseValidator';

export const updateSettingsSchema = z.object({
  siteName: z.string().optional(),
  siteTitle: z.string().optional(),
  siteDescription: z.string().optional(),
  contactEmail: z.string().optional(),
  location: z.string().optional(),
  authorName: z.string().optional(),
  authorEmail: z.string().optional(),
  authorRole: z.string().optional(),
  authorBio: z.string().optional(),
  authorAvatar: z.string().optional(),
  resumeUrl: z.string().optional(),
  currentStatus: z.string().optional(),
  currentProject: z.string().optional(),
  currentProjectStatus: z.string().optional(),
  currentProjectId: z.string().optional(),
  currentProjectSlug: z.string().optional(),
  availabilityStatus: z.string().optional(),
  // Field aliases for convenience
  name: z.string().optional(),
  title: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
  githubUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
  twitterUrl: z.string().optional(),
  leetcodeUrl: z.string().optional(),
  googleCloudUrl: z.string().optional(),
  socialLinks: z
    .union([
      z.array(
        z.object({
          platform: z.string(),
          url: z.string(),
          icon: z.string().optional(),
          label: z.string().optional(),
        })
      ),
      z.record(z.any()),
    ])
    .optional(),
  seoDefaults: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      ogImage: z.string().optional(),
      keywords: z.array(z.string()).optional(),
    })
    .optional(),
  analytics: z
    .object({
      enabled: z.boolean().optional(),
      trackingId: z.string().optional(),
    })
    .optional(),
});

export class SettingsValidator extends BaseValidator<z.infer<typeof updateSettingsSchema>> {
  protected schema = updateSettingsSchema;
}

export const settingsValidator = new SettingsValidator();
