import mongoose, { Schema, model, type Document, Types } from 'mongoose';

export interface ISessionDocument extends Document {
  sessionId: string;
  userId: Types.ObjectId;
  expiresAt: Date;
  rememberMe: boolean;
  userAgent?: string;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new Schema<ISessionDocument>(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    expiresAt: { type: Date, required: true, expires: 0 }, // Mongoose automatic TTL index
    rememberMe: { type: Boolean, default: false },
    userAgent: { type: String },
    ipAddress: { type: String },
  },
  {
    timestamps: true,
  }
);

if (mongoose.models.Session) {
  delete mongoose.models.Session;
}

export const SessionModel = model<ISessionDocument>('Session', SessionSchema, 'sessions');
