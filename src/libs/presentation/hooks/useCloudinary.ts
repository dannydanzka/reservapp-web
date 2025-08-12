import { useCallback, useState } from 'react';

import { handleApiRequest } from '@shared/utils/handleApiRequest';

export interface CloudinaryUploadResult {
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

export interface UploadOptions {
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

interface UseCloudinaryReturn {
  uploadImage: (file: File, options?: UploadOptions) => Promise<CloudinaryUploadResult | null>;
  uploadMultipleImages: (
    files: File[],
    options?: UploadOptions
  ) => Promise<CloudinaryUploadResult[]>;
  deleteImage: (publicId: string) => Promise<boolean>;
  generateImageUrl: (publicId: string, width?: number, height?: number) => string;
  generateThumbnailUrl: (publicId: string, size?: number) => string;
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
  isReady: boolean;
}

const useCloudinary = (): UseCloudinaryReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const uploadImage = useCallback(
    async (file: File, options: UploadOptions = {}): Promise<CloudinaryUploadResult | null> => {
      setIsUploading(true);
      setError(null);
      setUploadProgress(0);

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append(
          'options',
          JSON.stringify({
            folder: 'reservapp/services',
            ...options,
          })
        );

        setUploadProgress(50);

        const response = await handleApiRequest('/api/upload/image', {
          body: formData,
          method: 'POST',
        });

        if (response.success) {
          setUploadProgress(100);
          return response.data;
        } else {
          setError(response.error || 'Upload failed');
          return null;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        setError(errorMessage);
        console.error('Upload error:', error);
        return null;
      } finally {
        setIsUploading(false);
        setTimeout(() => setUploadProgress(0), 1000);
      }
    },
    []
  );

  const uploadMultipleImages = useCallback(
    async (files: File[], options: UploadOptions = {}): Promise<CloudinaryUploadResult[]> => {
      setIsUploading(true);
      setError(null);
      setUploadProgress(0);

      try {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append('files', file);
        });
        formData.append(
          'options',
          JSON.stringify({
            folder: 'reservapp/services',
            ...options,
          })
        );

        setUploadProgress(30);

        const response = await handleApiRequest('/api/upload/images', {
          body: formData,
          method: 'POST',
        });

        if (response.success) {
          setUploadProgress(100);
          return response.data;
        } else {
          setError(response.error || 'Multiple upload failed');
          return [];
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Multiple upload failed';
        setError(errorMessage);
        console.error('Multiple upload error:', error);
        return [];
      } finally {
        setIsUploading(false);
        setTimeout(() => setUploadProgress(0), 1000);
      }
    },
    []
  );

  const deleteImage = useCallback(async (publicId: string): Promise<boolean> => {
    setError(null);

    try {
      const response = await handleApiRequest(`/api/upload/image/${publicId}`, {
        method: 'DELETE',
      });

      return response.success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Delete failed';
      setError(errorMessage);
      console.error('Delete error:', error);
      return false;
    }
  }, []);

  const generateImageUrl = useCallback(
    (publicId: string, width?: number, height?: number): string => {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      if (!cloudName) return '';

      let url = `https://res.cloudinary.com/${cloudName}/image/upload/`;

      const transformations = [];
      if (width) transformations.push(`w_${width}`);
      if (height) transformations.push(`h_${height}`);
      transformations.push('f_auto', 'q_auto');

      if (transformations.length > 0) {
        url += transformations.join(',') + '/';
      }

      return url + publicId;
    },
    []
  );

  const generateThumbnailUrl = useCallback(
    (publicId: string, size: number = 150): string => {
      return generateImageUrl(publicId, size, size);
    },
    [generateImageUrl]
  );

  return {
    deleteImage,
    error,
    generateImageUrl,
    generateThumbnailUrl,
    isReady: Boolean(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME),
    isUploading,
    uploadImage,
    uploadMultipleImages,
    uploadProgress,
  };
};

export { useCloudinary };
