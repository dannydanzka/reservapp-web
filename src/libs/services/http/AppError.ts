/**
 * Custom application error class based on Jafra's AppError pattern
 */

export class AppError<T = unknown> extends Error {
  public readonly content: T;

  constructor(content: T, message?: string) {
    super(message);

    // Stack trace following for debugging (V8 only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }

    this.name = 'AppError';
    this.content = content;
  }
}
