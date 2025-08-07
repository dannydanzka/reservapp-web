import { NextRequest, NextResponse } from 'next/server';

import { cloudinaryService } from '@/libs/services/cloudinary/cloudinaryService';

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
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
    const file = formData.get('file') as File;
    const optionsStr = formData.get('options') as string;

    if (!file) {
      return createResponse(false, 'No file provided', undefined, 'File is required');
    }

    let options = {};
    if (optionsStr) {
      try {
        options = JSON.parse(optionsStr);
      } catch (error) {
        console.warn('Invalid options JSON:', error);
      }
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert buffer to base64 data URL
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    const result = await cloudinaryService.uploadImage(dataUrl, options);

    return createResponse(true, 'Image uploaded successfully', result);
  } catch (error) {
    console.error('POST /api/upload/image error:', error);
    return createResponse(
      false,
      'Failed to upload image',
      undefined,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}
