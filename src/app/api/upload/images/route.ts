import { NextRequest, NextResponse } from 'next/server';

import { cloudinaryService } from '@/libs/services/cloudinary/cloudinaryService';

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

interface UploadOptions {
  folder?: string;
  public_id?: string;
  overwrite?: boolean;
  resource_type?: 'image' | 'video' | 'raw' | 'auto';
}

interface UploadResult {
  public_id?: string;
  secure_url?: string;
  url?: string;
  error?: string;
  filename?: string;
  success?: boolean;
}

function createResponse<T>(
  success: boolean,
  message: string,
  data?: T,
  error?: string
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    data,
    error,
    message,
    success,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const optionsStr = formData.get('options') as string;

    if (!files || files.length === 0) {
      return createResponse(false, 'No files provided', undefined, 'At least one file is required');
    }

    let options = {};
    if (optionsStr) {
      try {
        options = JSON.parse(optionsStr);
      } catch (error) {
        console.warn('Invalid options JSON:', error);
      }
    }

    // Process all files in parallel
    const uploadPromises = files.map(async (file) => {
      try {
        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Convert buffer to base64 data URL
        const base64 = buffer.toString('base64');
        const dataUrl = `data:${file.type};base64,${base64}`;

        const result = await cloudinaryService.uploadImage(dataUrl, {
          ...options,
          public_id: (options as UploadOptions).public_id
            ? `${(options as UploadOptions).public_id}_${Date.now()}`
            : undefined,
        });
        return result;
      } catch (error) {
        console.error('Error uploading file:', file.name, error);
        return {
          error: `Failed to upload ${file.name}`,
          filename: file.name,
          success: false,
        } as UploadResult;
      }
    });

    const results = await Promise.all(uploadPromises);

    const successCount = results.filter((r) => !(r as UploadResult).error).length;
    const failureCount = results.length - successCount;

    return createResponse(
      failureCount === 0,
      failureCount === 0
        ? `Successfully uploaded ${successCount} images`
        : `Uploaded ${successCount} images, ${failureCount} failed`,
      results
    );
  } catch (error) {
    console.error('POST /api/upload/images error:', error);
    return createResponse(
      false,
      'Failed to upload images',
      undefined,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}
