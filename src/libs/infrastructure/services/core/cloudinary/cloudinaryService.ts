import { v2 as cloudinary } from 'cloudinary';

interface CloudinaryConfig {
  cloud_name: string;
  api_key: string;
  api_secret: string;
}

interface UploadOptions {
  folder?: string;
  transformation?: Array<{
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
    format?: string;
  }>;
  public_id?: string;
  overwrite?: boolean;
  resource_type?: 'image' | 'video' | 'raw' | 'auto';
}

interface CloudinaryUploadResult {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  original_filename: string;
  api_key: string;
}

class CloudinaryService {
  private isConfigured: boolean = false;

  constructor() {
    this.configure();
  }

  private configure(): void {
    try {
      const config: CloudinaryConfig = {
        api_key: process.env.CLOUDINARY_API_KEY || '',
        api_secret: process.env.CLOUDINARY_API_SECRET || '',
        cloud_name:
          process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME || '',
      };

      if (!config.cloud_name || !config.api_key || !config.api_secret) {
        console.warn('Cloudinary configuration incomplete. Some features may not work.');
        return;
      }

      cloudinary.config(config);
      this.isConfigured = true;
    } catch (error) {
      console.error('Failed to configure Cloudinary:', error);
    }
  }

  public async uploadImage(
    file: string | Buffer,
    options: UploadOptions = {}
  ): Promise<CloudinaryUploadResult> {
    if (!this.isConfigured) {
      throw new Error('Cloudinary is not properly configured');
    }

    try {
      const defaultOptions = {
        fetch_format: 'auto',
        folder: 'reservapp',
        quality: 'auto',
        resource_type: 'image' as const,
      };

      const uploadOptions = { ...defaultOptions, ...options };

      const result = await cloudinary.uploader.upload(file as string, uploadOptions);

      return result as unknown as CloudinaryUploadResult;
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      throw new Error(`Upload failed: ${error}`);
    }
  }

  public async uploadMultipleImages(
    files: Array<string | Buffer>,
    options: UploadOptions = {}
  ): Promise<CloudinaryUploadResult[]> {
    if (!this.isConfigured) {
      throw new Error('Cloudinary is not properly configured');
    }

    try {
      const uploadPromises = files.map((file) => this.uploadImage(file, options));
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading multiple images:', error);
      throw new Error(`Multiple upload failed: ${error}`);
    }
  }

  public async deleteImage(publicId: string): Promise<{ result: string }> {
    if (!this.isConfigured) {
      throw new Error('Cloudinary is not properly configured');
    }

    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
      throw new Error(`Delete failed: ${error}`);
    }
  }

  public generateImageUrl(
    publicId: string,
    transformations?: Array<{
      width?: number;
      height?: number;
      crop?: string;
      quality?: string | number;
      format?: string;
    }>
  ): string {
    if (!this.isConfigured) {
      return '';
    }

    try {
      return cloudinary.url(publicId, {
        transformation: transformations,
      });
    } catch (error) {
      console.error('Error generating image URL:', error);
      return '';
    }
  }

  public generateOptimizedImageUrl(publicId: string, width?: number, height?: number): string {
    const transformations = [
      {
        format: 'auto',
        quality: 'auto',
        ...(width && { width }),
        ...(height && { height }),
        crop: 'fill',
      },
    ];

    return this.generateImageUrl(publicId, transformations);
  }

  public generateThumbnailUrl(publicId: string, size: number = 150): string {
    return this.generateOptimizedImageUrl(publicId, size, size);
  }

  public async getImageInfo(publicId: string): Promise<CloudinaryUploadResult> {
    if (!this.isConfigured) {
      throw new Error('Cloudinary is not properly configured');
    }

    try {
      const result = await cloudinary.api.resource(publicId);
      return result as unknown as CloudinaryUploadResult;
    } catch (error) {
      console.error('Error getting image info:', error);
      throw new Error(`Get image info failed: ${error}`);
    }
  }

  public isReady(): boolean {
    return this.isConfigured;
  }
}

export const cloudinaryService = new CloudinaryService();
export type { CloudinaryUploadResult, UploadOptions };
