import mongoose, { Schema, model, type Document } from 'mongoose';

export interface IMediaDocument extends Document {
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  dimensions?: { width: number; height: number };
  folder: string;
  tags: string[];
  publicId?: string; // Cloudinary or storage identifier
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IMediaDocument>(
  {
    filename: { type: String, default: 'image.jpg', trim: true },
    originalName: { type: String, default: 'image.jpg', trim: true },
    url: { type: String, required: true },
    mimeType: { type: String, default: 'image/jpeg', index: true },
    sizeBytes: { type: Schema.Types.Mixed, default: 102400 },
    dimensions: {
      width: Number,
      height: Number,
    },
    folder: { type: String, default: 'general', index: true },
    tags: [{ type: String, index: true }],
    publicId: { type: String },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

MediaSchema.index({ filename: 'text', originalName: 'text', folder: 'text', tags: 'text' });

if (mongoose.models.Media) {
  delete mongoose.models.Media;
}

export const MediaModel = model<IMediaDocument>('Media', MediaSchema, 'media');
