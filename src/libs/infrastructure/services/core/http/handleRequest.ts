import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

import { buildURL } from './buildURL';
import { defaultErrorHandling } from './defaultErrorHandling';
import { HandleRequestParams } from './interfaces';
import { injectAuthorizationHeader } from './injectAuthorizationHeader';

/**
 * Universal HTTP request handler based on Jafra's handleRequest pattern
 */
export const handleRequest = async ({
  body,
  customDefaultErrorMessage = false,
  endpoint,
  extraCustomQuery = '',
  fileToDownload,
  headers = {},
  isErrorString = false,
  isPlainText = false,
  method,
  mockedResponse,
  params,
  preProcessResponse,
  query,
  shouldReturnErrorCodeFirst = false,
  simulate = false,
  timeout = 30000,
  upload,
  url,
}: HandleRequestParams): Promise<any> => {
  try {
    // Simulation mode for testing/development
    if (simulate) {
      return await new Promise((resolve) => {
        setTimeout(() => {
          const mockedResponseToReturn =
            typeof mockedResponse === 'function' ? mockedResponse() : mockedResponse;
          resolve(mockedResponseToReturn);
        }, 1000);
      });
    }

    // Validation
    if (!endpoint) throw new Error('No se especificó el endpoint');

    // Build the complete URL
    // If url is not provided, assume endpoint is already a complete URL
    const URL = url ? buildURL({ endpoint, extraCustomQuery, params, query, url }) : endpoint;

    // Handle file uploads
    let formData: FormData;
    const requestHeaders = injectAuthorizationHeader(headers);
    let requestData = body;
    let contentType = 'application/json';

    if (upload) {
      formData = new FormData();
      formData.append(upload.inputName, upload.file, `${uuidv4()}-${upload.file.name}`);
      if (body) {
        Object.entries(body).forEach(([key, value]) => formData.append(key, value as string));
      }
      requestData = formData;
      contentType = 'multipart/form-data';
    }

    // Make the request
    const response = await axios.request({
      data: requestData ?? undefined,
      headers: {
        ...requestHeaders,
        ...(upload ? {} : { 'Content-Type': contentType }),
      },
      method,
      responseType: fileToDownload ? 'blob' : isPlainText ? 'text' : 'json',
      timeout,
      url: URL,
    });

    // Handle file downloads
    if (fileToDownload) {
      // For browser environments, trigger download
      if (typeof window !== 'undefined') {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileToDownload);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }
      return null;
    }

    const responseData = preProcessResponse ? preProcessResponse(response.data) : response.data;

    return responseData;
  } catch (error: any) {
    return defaultErrorHandling(
      error,
      customDefaultErrorMessage,
      shouldReturnErrorCodeFirst,
      isErrorString
    );
  }
};
