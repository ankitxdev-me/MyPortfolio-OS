import mongoose, { Schema, model, type Document } from 'mongoose';

export interface ISettingsDocument extends Document {
  key: string; // E.g., "global_site_settings"
  siteName: string;
  siteTitle: string;
  siteDescription: string;
  contactEmail: string;
  location: string;
  authorName: string;
  authorEmail: string;
  authorRole: string;
  authorBio: string;
  authorAvatar: string;
  resumeUrl: string;
  currentStatus?: string;
  currentProject?: string;
  currentProjectStatus?: string;
  currentProjectId?: string;
  currentProjectSlug?: string;
  socialLinks: { platform: string; url: string; icon: string }[];
  seoDefaults: { metaTitle: string; metaDescription: string; ogImage: string; keywords: string[] };
  analytics: { enabled: boolean; trackingId?: string };
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettingsDocument>(
  {
    key: { type: String, required: true, unique: true, default: 'global_site_settings', index: true },
    siteName: { type: String, required: true, default: 'Portfolio OS' },
    siteTitle: { type: String, required: true, default: 'Ankit Gupta — Lead Full-Stack & AI Engineer' },
    siteDescription: { type: String, required: true },
    contactEmail: { type: String, default: 'ankitgupta72724@gmail.com' },
    location: { type: String, default: 'Pune, India / Remote' },
    authorName: { type: String, required: true, default: 'Ankit Gupta' },
    authorEmail: { type: String, required: true, default: 'ankitgupta72724@gmail.com' },
    authorRole: { type: String, required: true, default: 'Full-Stack Software Engineer' },
    authorBio: {
      type: String,
      default:
        'Software Engineer specializing in autonomous AI workflows, Next.js SaaS products, high-performance web architecture, and developer tools.',
    },
    authorAvatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    },
    resumeUrl: { type: String, default: '/assets/resume.pdf' },
    currentStatus: { type: String, default: 'Currently Building AutoOps AI' },
    currentProject: { type: String, default: 'AutoOps AI' },
    currentProjectStatus: { type: String, default: 'Sprint 3 Active' },
    currentProjectId: { type: String, default: '' },
    currentProjectSlug: { type: String, default: '' },
    socialLinks: [{ platform: String, url: String, icon: String }],
    seoDefaults: {
      metaTitle: String,
      metaDescription: String,
      ogImage: String,
      keywords: [String],
    },
    analytics: {
      enabled: { type: Boolean, default: false },
      trackingId: String,
    },
  },
  {
    timestamps: true,
  }
);

if (mongoose.models.Settings) {
  delete mongoose.models.Settings;
}

export const SettingsModel = model<ISettingsDocument>('Settings', SettingsSchema, 'settings');
