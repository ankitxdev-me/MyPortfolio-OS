import mongoose, { Schema, model, type Document } from 'mongoose';

export interface IContactMessageDocument extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ContactMessageSchema = new Schema<IContactMessageDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, index: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    status: { type: String, default: 'unread', index: true },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

ContactMessageSchema.index({ name: 'text', email: 'text', subject: 'text', message: 'text' });

if (mongoose.models.ContactMessage) {
  delete mongoose.models.ContactMessage;
}

export const ContactMessageModel = model<IContactMessageDocument>('ContactMessage', ContactMessageSchema, 'contactMessages');
