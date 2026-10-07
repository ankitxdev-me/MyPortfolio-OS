import mongoose, { Schema, model, type Document } from 'mongoose';

export interface IUserDocument extends Document {
  id: string;
  email: string;
  name: string;
  role: string;
  passwordHash: string;
  avatarUrl?: string;
  bio?: string;
  status: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, default: 'admin', index: true },
    passwordHash: { type: String, required: true },
    avatarUrl: { type: String },
    bio: { type: String },
    status: { type: String, default: 'active', index: true },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        const obj = ret as Record<string, unknown>;
        obj.id = (obj._id as { toString(): string })?.toString();
        delete obj._id;
        delete obj.__v;
        delete obj.passwordHash;
        return obj;
      },
    },
  }
);

if (mongoose.models.User) {
  delete mongoose.models.User;
}

export const UserModel = model<IUserDocument>('User', UserSchema, 'users');
