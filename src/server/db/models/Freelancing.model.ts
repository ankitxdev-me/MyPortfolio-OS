import mongoose, { Schema, model, type Document, Types } from 'mongoose';

export interface IFreelancingDocument extends Document {
  slug: string;
  title: string;
  clientName: string;
  industry: string;
  projectType: string;
  duration: string;
  status: string;
  published: boolean;
  featured: boolean;
  techStack: string[];
  description: string;
  objectives: string[];
  deliverables: string[];
  challenges: { problem: string; solution: string; outcome: string }[];
  businessImpact: { metric: string; label: string }[];
  testimonial?: {
    id: string;
    clientName: string;
    role: string;
    company: string;
    projectTitle: string;
    rating: number;
    feedback: string;
  };
  connectedProjectIds?: Types.ObjectId[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FreelancingSchema = new Schema<IFreelancingDocument>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    clientName: { type: String, required: true, index: true },
    industry: { type: String, required: true, index: true },
    projectType: { type: String, required: true },
    duration: { type: String, required: true },
    status: { type: String, default: 'Completed', index: true },
    published: { type: Boolean, default: true, index: true },
    featured: { type: Boolean, default: false, index: true },
    techStack: [{ type: String, index: true }],
    description: { type: String, required: true },
    objectives: [String],
    deliverables: [String],
    challenges: [{ problem: String, solution: String, outcome: String }],
    businessImpact: [{ metric: String, label: String }],
    testimonial: {
      id: String,
      clientName: String,
      role: String,
      company: String,
      projectTitle: String,
      rating: Number,
      feedback: String,
    },
    connectedProjectIds: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
    isDeleted: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

FreelancingSchema.index({ title: 'text', clientName: 'text', industry: 'text', description: 'text' });

if (mongoose.models.Freelancing) {
  delete mongoose.models.Freelancing;
}

export const FreelancingModel = model<IFreelancingDocument>('Freelancing', FreelancingSchema, 'freelancing');
