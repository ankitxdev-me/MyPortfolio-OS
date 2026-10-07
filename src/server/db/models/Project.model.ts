import mongoose, { Schema, model, type Document, Types } from 'mongoose';

export interface IProjectDocument extends Document {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  status: string;
  progress: number;
  featured: boolean;
  published: boolean;
  startDate: string;
  deadline: string;
  githubUrl: string;
  liveUrl: string;
  image: string;
  gallery: { src: string; caption: string }[];
  metrics: { label: string; value: string }[];
  techStack: {
    frontend: string[];
    backend: string[];
    database: string[];
    infrastructure: string[];
  };
  overview: string;
  architectureOverview: string;
  features: string[];
  timeline: { date: string; title: string; description: string; status: 'Completed' | 'In Progress' | 'Planned' }[];
  challenges: { id: string; title: string; problem: string; solution: string; outcome: string }[];
  lessonsLearned: { engineering: string; architecture: string; performance: string };
  relatedBlogIds?: Types.ObjectId[];
  relatedLearningIds?: Types.ObjectId[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProjectDocument>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: '' },
    category: { type: String, default: 'Web Development', index: true },
    description: { type: String, default: '' },
    status: { type: String, default: 'In Progress', index: true },
    progress: { type: Number, default: 0 },
    featured: { type: Boolean, default: false, index: true },
    published: { type: Boolean, default: true, index: true },
    startDate: { type: String, default: '' },
    deadline: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    liveUrl: { type: String, default: '' },
    image: { type: String, default: '/images/projects/autoops.jpg' },
    gallery: [{ src: String, caption: String }],
    metrics: [{ label: String, value: String }],
    techStack: {
      frontend: [String],
      backend: [String],
      database: [String],
      infrastructure: [String],
    },
    overview: { type: String },
    architectureOverview: { type: String },
    features: [String],
    timeline: [{ date: String, title: String, description: String, status: String }],
    challenges: [{ id: String, title: String, problem: String, solution: String, outcome: String }],
    lessonsLearned: {
      engineering: String,
      architecture: String,
      performance: String,
    },
    relatedBlogIds: [{ type: Schema.Types.ObjectId, ref: 'Blog' }],
    relatedLearningIds: [{ type: Schema.Types.ObjectId, ref: 'Learning' }],
    isDeleted: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

ProjectSchema.index({ title: 'text', description: 'text', category: 'text' });

if (mongoose.models.Project) {
  delete mongoose.models.Project;
}

export const ProjectModel = model<IProjectDocument>('Project', ProjectSchema, 'projects');
