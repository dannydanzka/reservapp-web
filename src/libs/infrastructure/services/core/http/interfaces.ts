/**
 * HTTP service interfaces based on Jafra's handleRequest pattern
 */

export interface HandleRequestParams {
  body?: Record<string, any>;
  customDefaultErrorMessage?: string | false;
  endpoint?: string;
  extraCustomQuery?: string;
  fileToDownload?: string;
  headers?: Record<string, string>;
  isErrorString?: boolean;
  isPlainText?: boolean;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  mockedResponse?: any;
  params?: Record<string, any>;
  preProcessResponse?: (data: any) => any;
  query?: Record<string, any>;
  shouldReturnErrorCodeFirst?: boolean;
  simulate?: boolean;
  timeout?: number;
  upload?: { inputName: string; file: File };
  url?: string;
}

export interface BuildURLParams {
  endpoint: string;
  extraCustomQuery?: string;
  params?: Record<string, string>;
  query?: Record<string, string | number | boolean | string[]>;
  url: string;
}

export interface ErrorResponse {
  response?: {
    status?: string;
    data?:
      | {
          error?: {
            code?: string;
            description?: string;
          };
        }
      | string;
  };
}
