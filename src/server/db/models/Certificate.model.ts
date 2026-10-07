import mongoose, { Schema, model, type Document } from 'mongoose';

export interface ICertificateDocument extends Document {
  slug: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId: string;
  url: string;
  category?: string;
  description?: string;
  published: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CertificateSchema = new Schema<ICertificateDocument>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    issuer: { type: String, required: true, trim: true },
    issueDate: { type: String, default: '' },
    credentialId: { type: String, default: '' },
    url: { type: String, default: '' },
    category: { type: String, default: 'Cloud & DevOps' },
    description: { type: String, default: '' },
    published: { type: Boolean, default: true, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

CertificateSchema.index({ title: 'text', issuer: 'text', credentialId: 'text' });

if (mongoose.models.Certificate) {
  delete mongoose.models.Certificate;
}

export const CertificateModel = model<ICertificateDocument>('Certificate', CertificateSchema, 'certificates');
