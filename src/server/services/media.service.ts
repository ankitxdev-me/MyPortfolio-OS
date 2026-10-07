import { BaseService } from '../base/BaseService';
import { mediaRepository, MediaRepository } from '../db/repositories/MediaRepository';
import { cloudinaryStorage, CloudinaryStorageAdapter } from '../storage/cloudinary';
import { mediaValidator } from '../validators/media.validator';
import type { MediaAsset } from '@/data/mediaData';
import { NotFoundError } from '../errors/HttpError';
import { logger } from '../logger/logger';

export class MediaService extends BaseService<MediaAsset & { id: string }> {
  constructor(
    repository: MediaRepository = mediaRepository,
    private readonly storage: CloudinaryStorageAdapter = cloudinaryStorage
  ) {
    super(repository);
  }

  public async uploadAsset(
    fileBuffer: Buffer | ArrayBuffer,
    fileName: string,
    mimeType: string,
    folder: string = 'general',
    altText: string = '',
    tags: string[] = []
  ): Promise<MediaAsset & { id: string }> {
    const sizeNumber = Buffer.isBuffer(fileBuffer) ? fileBuffer.length : fileBuffer.byteLength;
    mediaValidator.validateFile({ name: fileName, size: sizeNumber, type: mimeType });

    logger.info(`MediaService: Uploading asset [${fileName}] (${(sizeNumber / 1024).toFixed(1)} KB) to folder [${folder}]`);

    const result = await this.storage.upload(fileBuffer, fileName, folder, mimeType);
    const thumbnailUrl = this.storage.getThumbnailUrl(result.publicId);
    const responsiveUrl = this.storage.getTransformUrl(result.publicId, { width: 1200, quality: 'auto' });

    const payload = {
      name: fileName,
      filename: fileName,
      originalName: fileName,
      type: (mimeType.startsWith('image/') ? 'Image' : 'Document') as 'Image' | 'Document' | 'Diagram',
      url: result.secureUrl || result.url,
      optimizedUrl: responsiveUrl,
      thumbnailUrl,
      publicId: result.publicId,
      mimeType,
      size: `${(sizeNumber / 1024).toFixed(1)} KB`,
      width: result.width,
      height: result.height,
      folder,
      altText: altText || fileName,
      tags: tags.length > 0 ? tags : [folder],
      uploadedAt: new Date().toISOString(),
    };

    return this.create(payload as unknown as Partial<MediaAsset & { id: string }>);
  }

  public async updateMetadata(
    id: string,
    data: { altText?: string; folder?: string; tags?: string[] }
  ): Promise<MediaAsset & { id: string }> {
    const existing = await this.getById(id);
    if (!existing) throw new NotFoundError(`Media asset [ID: ${id}] not found`);

    logger.info(`MediaService: Updating metadata for media asset [ID: ${id}]`);
    return this.update(id, data as Partial<MediaAsset & { id: string }>);
  }

  public async replaceAsset(
    id: string,
    fileBuffer: Buffer | ArrayBuffer,
    fileName: string,
    mimeType: string
  ): Promise<MediaAsset & { id: string }> {
    const existing = await this.getById(id);
    if (!existing) throw new NotFoundError(`Media asset to replace [ID: ${id}] not found`);

    const sizeNumber = Buffer.isBuffer(fileBuffer) ? fileBuffer.length : fileBuffer.byteLength;
    mediaValidator.validateFile({ name: fileName, size: sizeNumber, type: mimeType });

    if (existing.publicId) {
      await this.storage.delete(existing.publicId);
    }

    logger.info(`MediaService: Replacing file content for asset [ID: ${id}]`);
    const targetFolder = existing.folder || 'general';
    const result = await this.storage.upload(fileBuffer, fileName, targetFolder, mimeType);

    const payload = {
      name: fileName,
      filename: fileName,
      url: result.secureUrl || result.url,
      optimizedUrl: this.storage.getTransformUrl(result.publicId, { width: 1200 }),
      thumbnailUrl: this.storage.getThumbnailUrl(result.publicId),
      publicId: result.publicId,
      mimeType,
      size: `${(sizeNumber / 1024).toFixed(1)} KB`,
      width: result.width,
      height: result.height,
      uploadedAt: new Date().toISOString(),
    };

    return this.update(id, payload as unknown as Partial<MediaAsset & { id: string }>);
  }

  public async deleteAsset(id: string): Promise<boolean> {
    const existing = await this.getById(id);
    if (!existing) throw new NotFoundError(`Media asset [ID: ${id}] not found`);

    if (existing.publicId) {
      await this.storage.delete(existing.publicId);
    }

    logger.info(`MediaService: Deleting media asset [ID: ${id}]`);
    return this.repository.delete(id);
  }
}

export const mediaService = new MediaService();
