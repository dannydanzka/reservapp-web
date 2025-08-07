import { AppError } from './AppError';
import { DEFAULT_ERROR_MESSAGE } from './constants';
import { ErrorResponse } from './interfaces';

/**
 * Default error handling for HTTP requests
 */
const defaultErrorHandling = (
  error: ErrorResponse,
  customDefaultErrorMessage?: string | false,
  shouldReturnErrorCodeFirst = false,
  isErrorString = false
): never => {
  let errorMessage: string | null | undefined;

  if (typeof error.response?.data === 'string' && isErrorString) {
    errorMessage = error.response.data;
  } else {
    let errorData = error?.response?.data as {
      error?: { code?: string; description?: string | null };
      code?: string;
      description?: string | null;
      message?: string;
    };

    if (shouldReturnErrorCodeFirst) {
      errorMessage = errorData?.error?.code ? errorData?.error?.code : errorData?.code;
    } else {
      errorMessage = errorData?.error?.description || errorData?.description || errorData?.message;
    }
  }

  errorMessage =
    errorMessage === 'unhandled.error' || !errorMessage ? DEFAULT_ERROR_MESSAGE : errorMessage;
  errorMessage = customDefaultErrorMessage || errorMessage;

  throw new AppError(error?.response?.data, errorMessage);
};

export { defaultErrorHandling };
