import { MongooseBaseRepository } from './MongooseBaseRepository';
import { ContactMessageModel, type IContactMessageDocument } from '../models/ContactMessage.model';

export interface ContactMessageEntity {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'archived';
  createdAt: Date;
}

export class ContactMessageRepository extends MongooseBaseRepository<ContactMessageEntity, IContactMessageDocument> {
  constructor() {
    super(ContactMessageModel);
  }

  public async findUnread(): Promise<ContactMessageEntity[]> {
    return this.find({ status: 'unread' });
  }

  public async markAsRead(id: string): Promise<ContactMessageEntity | null> {
    return this.update(id, { status: 'read' });
  }
}

export const contactMessageRepository = new ContactMessageRepository();
