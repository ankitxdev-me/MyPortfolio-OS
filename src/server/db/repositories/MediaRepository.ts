import { MongooseBaseRepository } from './MongooseBaseRepository';
import { MediaModel, type IMediaDocument } from '../models/Media.model';
import type { MediaAsset } from '@/data/mediaData';

export class MediaRepository extends MongooseBaseRepository<MediaAsset & { id: string }, IMediaDocument> {
  constructor() {
    super(MediaModel);
  }

  public async findByFolder(folder: string): Promise<(MediaAsset & { id: string })[]> {
    return this.find({ folder });
  }

  public async findByMimeType(mimeType: string): Promise<(MediaAsset & { id: string })[]> {
    return this.find({ mimeType });
  }
}

export const mediaRepository = new MediaRepository();
