import { BaseController } from '../base/BaseController';
import { mediaService, MediaService } from '../services/media.service';
import type { MediaAsset } from '@/data/mediaData';
import { mediaValidator } from '../validators/media.validator';
import { successResponse } from '../api/response';
import { ValidationError } from '../errors/ValidationError';

export class MediaController extends BaseController<MediaAsset & { id: string }> {
  constructor(service: MediaService = mediaService) {
    super(service);
  }

  public async uploadFile(formData: FormData): Promise<Response> {
    const file = formData.get('file');
    if (!file || !(file instanceof File)) {
      throw new ValidationError('Upload request missing valid file payload in form-data key [file]');
    }

    const folder = (formData.get('folder') as string) || 'general';
    const altText = (formData.get('altText') as string) || file.name;
    const tagsRaw = formData.get('tags');
    const tags = typeof tagsRaw === 'string' ? tagsRaw.split(',').map((t) => t.trim()) : [folder];

    const arrayBuffer = await file.arrayBuffer();
    const uploaded = await (this.service as MediaService).uploadAsset(
      arrayBuffer,
      file.name,
      file.type,
      folder,
      altText,
      tags
    );

    return successResponse(uploaded, 'Media asset uploaded successfully', undefined, 201);
  }

  public async updateMetadata(id: string, data: unknown): Promise<Response> {
    const validated = mediaValidator.validatePartial(data);
    const updated = await (this.service as MediaService).updateMetadata(id, validated);
    return successResponse(updated, 'Media asset metadata updated successfully');
  }

  public async replaceFile(id: string, formData: FormData): Promise<Response> {
    const file = formData.get('file');
    if (!file || !(file instanceof File)) {
      throw new ValidationError('Replace request missing valid file payload in form-data key [file]');
    }

    const arrayBuffer = await file.arrayBuffer();
    const replaced = await (this.service as MediaService).replaceAsset(
      id,
      arrayBuffer,
      file.name,
      file.type
    );

    return successResponse(replaced, 'Media asset replaced successfully');
  }

  public async deleteAsset(id: string): Promise<Response> {
    await (this.service as MediaService).deleteAsset(id);
    return successResponse({ id }, 'Media asset deleted successfully');
  }
}

export const mediaController = new MediaController();
