import mongoose, { Schema, model, type Document, Types } from 'mongoose';

export interface ILearningDocument extends Document {
  slug: string;
  name: string;
  title?: string;
  platform?: string;
  instructor?: string;
  category: string;
  proficiency: number;
  progressPercent?: number;
  iconName: string;
  description: string;
  status: string;
  published: boolean;
  featured: boolean;
  isTopSkill: boolean;
  topics?: string[];
  timeline?: { date?: string; title?: string; description?: string }[];
  startDate?: string;
  targetCompletion?: string;
  startedDate?: string;
  completedDate?: string;
  certificateUrl?: string;
  credentialId?: string;
  hoursSpent: number;
  keyTakeaways: string[];
  architectureNotes: string;
  recommendedResources: { title: string; type: string; url: string }[];
  connectedProjectIds?: Types.ObjectId[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LearningSchema = new Schema<ILearningDocument>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    title: { type: String, default: '' },
    platform: { type: String, default: 'Self-Paced' },
    instructor: { type: String, default: 'Lead Architect' },
    category: {
      type: String,
      default: 'General',
      index: true,
    },
    proficiency: { type: Number, default: 80, min: 0, max: 100 },
    progressPercent: { type: Number, default: 80, min: 0, max: 100 },
    iconName: { type: String, default: 'Code2' },
    description: { type: String, default: '' },
    status: { type: String, default: 'In Progress', index: true },
    published: { type: Boolean, default: true, index: true },
    featured: { type: Boolean, default: false, index: true },
    isTopSkill: { type: Boolean, default: false, index: true },
    topics: { type: [String], default: [] },
    timeline: [
      {
        date: { type: String, default: '' },
        title: { type: String, default: '' },
        description: { type: String, default: '' },
      },
    ],
    startDate: { type: String, default: '' },
    targetCompletion: { type: String, default: '' },
    startedDate: { type: String, default: () => new Date().toISOString() },
    completedDate: { type: String, default: '' },
    certificateUrl: { type: String, default: '' },
    credentialId: { type: String, default: '' },
    hoursSpent: { type: Number, default: 0 },
    keyTakeaways: [String],
    architectureNotes: String,
    recommendedResources: [{ title: String, type: { type: String }, url: String }],
    connectedProjectIds: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
    isDeleted: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

LearningSchema.index({ name: 'text', title: 'text', description: 'text', category: 'text' });

if (mongoose.models.Learning) {
  delete mongoose.models.Learning;
}

export const LearningModel = model<ILearningDocument>('Learning', LearningSchema, 'learning');
