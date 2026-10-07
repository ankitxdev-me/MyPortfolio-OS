import mongoose, { Schema, model, type Document, Types } from 'mongoose';

export interface IBlogDocument extends Document {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  publishedAt: string;
  readTime: string;
  category: string;
  tags: string[];
  featured: boolean;
  author: { name: string; avatar: string; role: string; bio: string };
  seo: { metaTitle?: string; metaDescription?: string; ogImage?: string; keywords?: string[] };
  relatedProjectIds?: Types.ObjectId[];
  status: string;
  published: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlogDocument>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String, required: true },
    publishedAt: { type: String, required: true },
    readTime: { type: String, required: true },
    category: { type: String, required: true, index: true },
    tags: [{ type: String, index: true }],
    featured: { type: Boolean, default: false, index: true },
    published: { type: Boolean, default: true, index: true },
    author: {
      name: { type: String, required: true },
      avatar: { type: String, required: true },
      role: { type: String, required: true },
      bio: { type: String, required: true },
    },
    seo: {
      metaTitle: String,
      metaDescription: String,
      ogImage: String,
      keywords: [String],
    },
    relatedProjectIds: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
    status: { type: String, default: 'published', index: true },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

BlogSchema.index({ title: 'text', excerpt: 'text', content: 'text', tags: 'text' });

if (mongoose.models.Blog) {
  delete mongoose.models.Blog;
}

export const BlogModel = model<IBlogDocument>('Blog', BlogSchema, 'blogs');
