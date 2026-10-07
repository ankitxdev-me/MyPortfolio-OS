import { MongooseBaseRepository } from './MongooseBaseRepository';
import { UserModel, type IUserDocument } from '../models/User.model';

export interface UserEntity {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  passwordHash: string;
  avatarUrl?: string;
  bio?: string;
  status: 'active' | 'inactive';
}

export class UserRepository extends MongooseBaseRepository<UserEntity, IUserDocument> {
  constructor() {
    super(UserModel);
  }

  public async findByEmail(email: string): Promise<UserEntity | null> {
    return this.findOne({ email: email.toLowerCase().trim() });
  }
}

export const userRepository = new UserRepository();
