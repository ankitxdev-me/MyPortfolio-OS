import mongoose, { Schema, model, type Document, Types } from 'mongoose';

export interface IJourneyDocument extends Document {
  slug: string;
  year: string;
  quarter: string;
  title: string;
  subtitle?: string;
  stage?: string;
  role?: string;
  organization?: string;
  tags?: string[];
  period?: string;
  category: string;
  summary: string;
  description: string;
  iconName: string;
  impactMetrics: { label: string; value: string }[];
  keyLearnings: string[];
  connectedProjectIds?: Types.ObjectId[];
  connectedBlogIds?: Types.ObjectId[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const JourneySchema = new Schema<IJourneyDocument>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    year: { type: String, required: true, index: true },
    quarter: { type: String, default: 'Q1' },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: '' },
    stage: { type: String, default: '' },
    role: { type: String, default: '' },
    organization: { type: String, default: '' },
    tags: [{ type: String }],
    period: { type: String, default: '' },
    category: {
      type: String,
      default: 'Career',
      index: true,
    },
    summary: { type: String, default: '' },
    description: { type: String, default: '' },
    iconName: { type: String, default: 'Compass' },
    impactMetrics: [{ label: String, value: String }],
    keyLearnings: [String],
    connectedProjectIds: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
    connectedBlogIds: [{ type: Schema.Types.ObjectId, ref: 'Blog' }],
    isDeleted: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
    strict: false,
  }
);

JourneySchema.index({ title: 'text', summary: 'text', year: 'text', category: 'text' });

if (mongoose.models.Journey) {
  delete mongoose.models.Journey;
}

export const JourneyModel = model<IJourneyDocument>('Journey', JourneySchema, 'journey');
