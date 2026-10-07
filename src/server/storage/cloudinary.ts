import { env } from '../config/env';
import { logger } from '../logger/logger';

export interface CloudinaryUploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

export class CloudinaryStorageAdapter {
  private readonly cloudName: string;
  private readonly apiKey: string;
  private readonly apiSecret: string;
  private readonly isConfigured: boolean;

  constructor() {
    this.cloudName = env.CLOUDINARY_CLOUD_NAME || '';
    this.apiKey = env.CLOUDINARY_API_KEY || '';
    this.apiSecret = env.CLOUDINARY_API_SECRET || '';
    this.isConfigured = Boolean(this.cloudName && this.apiKey && this.apiSecret);
  }

  public async upload(
    fileBuffer: Buffer | ArrayBuffer,
    fileName: string,
    folder: string = 'general',
    mimeType: string = 'image/png'
  ): Promise<CloudinaryUploadResult> {
    const cleanFileName = fileName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
    const publicId = `portfolio-os/${folder}/${cleanFileName}_${Date.now().toString(36)}`;

    if (!this.isConfigured) {
      logger.warn(`Cloudinary credentials missing in .env — using local mock storage adapter for asset [${fileName}]`);
      const mockUrl = `/images/uploads/${folder}/${cleanFileName}.webp`;
      return {
        publicId,
        url: mockUrl,
        secureUrl: mockUrl,
        format: mimeType.split('/')[1] || 'webp',
        width: 1200,
        height: 830,
        bytes: Buffer.isBuffer(fileBuffer) ? fileBuffer.length : fileBuffer.byteLength,
      };
    }

    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const signature = await this.generateSignature({ folder: `portfolio-os/${folder}`, public_id: publicId, timestamp });
      
      const formData = new FormData();
      const uint8 = Buffer.isBuffer(fileBuffer) ? new Uint8Array(fileBuffer) : new Uint8Array(fileBuffer);
      const blob = new Blob([uint8], { type: mimeType });
      formData.append('file', blob, fileName);
      formData.append('api_key', this.apiKey);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);
      formData.append('folder', `portfolio-os/${folder}`);
      formData.append('public_id', publicId);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Cloudinary upload failed: ${response.status} ${errorText}`);
      }

      const resData = (await response.json()) as Record<string, unknown>;
      return {
        publicId: resData.public_id as string,
        url: resData.url as string,
        secureUrl: resData.secure_url as string,
        format: resData.format as string,
        width: Number(resData.width) || 800,
        height: Number(resData.height) || 600,
        bytes: Number(resData.bytes) || 0,
      };
    } catch (err) {
      logger.error('Cloudinary API upload failed:', err);
      const mockUrl = `/images/uploads/${folder}/${cleanFileName}.webp`;
      return {
        publicId,
        url: mockUrl,
        secureUrl: mockUrl,
        format: 'webp',
        width: 1200,
        height: 830,
        bytes: Buffer.isBuffer(fileBuffer) ? fileBuffer.length : fileBuffer.byteLength,
      };
    }
  }

  public async delete(publicId: string): Promise<boolean> {
    if (!this.isConfigured) {
      logger.info(`Cloudinary deleted asset [${publicId}] (Mock Adapter)`);
      return true;
    }

    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const signature = await this.generateSignature({ public_id: publicId, timestamp });

      const formData = new FormData();
      formData.append('public_id', publicId);
      formData.append('api_key', this.apiKey);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/destroy`, {
        method: 'POST',
        body: formData,
      });

      return response.ok;
    } catch (err) {
      logger.error(`Cloudinary delete failed for asset [${publicId}]`, err);
      return false;
    }
  }

  public getTransformUrl(publicId: string, options: { width?: number; height?: number; crop?: string; quality?: string } = {}): string {
    if (!this.isConfigured || publicId.startsWith('/images/')) {
      return publicId;
    }
    const widthParam = options.width ? `w_${options.width},` : '';
    const heightParam = options.height ? `h_${options.height},` : '';
    const cropParam = options.crop ? `c_${options.crop},` : 'c_fill,';
    const qualityParam = options.quality ? `q_${options.quality},` : 'q_auto,';
    const transformations = `${cropParam}${widthParam}${heightParam}${qualityParam}f_auto`.replace(/,\$/, '');
    return `https://res.cloudinary.com/${this.cloudName}/image/upload/${transformations}/${publicId}`;
  }

  public getThumbnailUrl(publicId: string): string {
    return this.getTransformUrl(publicId, { width: 300, height: 300, crop: 'thumb', quality: 'auto' });
  }

  private async generateSignature(params: Record<string, string | number>): Promise<string> {
    const sortedKeys = Object.keys(params).sort();
    const toSign = sortedKeys.map((key) => `${key}=${params[key]}`).join('&') + this.apiSecret;
    
    const encoder = new TextEncoder();
    const data = encoder.encode(toSign);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
}

export const cloudinaryStorage = new CloudinaryStorageAdapter();
