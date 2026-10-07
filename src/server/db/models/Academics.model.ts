import mongoose, { Schema, model, type Document, Types } from 'mongoose';

export interface IAcademicsDocument extends Document {
  slug: string;
  semesterNumber: number;
  title: string;
  institution: string;
  degree: string;
  duration: string;
  sgpa: number;
  cgpaToDate: number;
  status: string;
  published: boolean;
  featured: boolean;
  subjects: { code: string; name: string; credits: number; grade: string; keyTopics: string[] }[];
  keyAchievements: string[];
  connectedProjectIds?: Types.ObjectId[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AcademicsSchema = new Schema<IAcademicsDocument>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    semesterNumber: { type: Number, default: 1, index: true },
    title: { type: String, required: true, trim: true },
    institution: { type: String, default: 'University' },
    degree: { type: String, default: 'B.Tech Computer Science' },
    duration: { type: String, default: '2022 - 2026' },
    sgpa: { type: Number, default: 9.0 },
    cgpaToDate: { type: Number, default: 9.0 },
    status: { type: String, default: 'Completed', index: true },
    published: { type: Boolean, default: true, index: true },
    featured: { type: Boolean, default: false, index: true },
    subjects: [
      {
        code: String,
        name: String,
        credits: Number,
        grade: String,
        keyTopics: [String],
      },
    ],
    keyAchievements: [String],
    connectedProjectIds: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
    isDeleted: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

AcademicsSchema.index({ title: 'text', institution: 'text', degree: 'text' });

if (mongoose.models.Academics) {
  delete mongoose.models.Academics;
}

export const AcademicsModel = model<IAcademicsDocument>('Academics', AcademicsSchema, 'academics');
