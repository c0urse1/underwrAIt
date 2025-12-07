// Custom Error Classes for the application

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    code: string = 'UNKNOWN_ERROR',
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Maintains proper stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, originalError?: Error) {
    super(
      `Datenbankfehler: ${message}`,
      'DATABASE_ERROR',
      500,
      true
    );
    this.name = 'DatabaseError';
    if (originalError) {
      this.stack = `${this.stack}\nCaused by: ${originalError.stack}`;
    }
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    super(
      id ? `${resource} mit ID "${id}" nicht gefunden` : `${resource} nicht gefunden`,
      'NOT_FOUND',
      404,
      true
    );
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends AppError {
  public readonly field?: string;

  constructor(message: string, field?: string) {
    super(message, 'VALIDATION_ERROR', 400, true);
    this.name = 'ValidationError';
    this.field = field;
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Netzwerkfehler') {
    super(
      `${message}. Bitte überprüfen Sie Ihre Internetverbindung.`,
      'NETWORK_ERROR',
      503,
      true
    );
    this.name = 'NetworkError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentifizierung fehlgeschlagen') {
    super(message, 'AUTH_ERROR', 401, true);
    this.name = 'AuthenticationError';
  }
}

// Error type guards
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function isNotFoundError(error: unknown): error is NotFoundError {
  return error instanceof NotFoundError;
}

export function isDatabaseError(error: unknown): error is DatabaseError {
  return error instanceof DatabaseError;
}

// Error formatting for user display
export function formatErrorForUser(error: unknown): string {
  if (isAppError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    // Don't expose internal error messages in production
    if (process.env.NODE_ENV === 'production') {
      return 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.';
    }
    return error.message;
  }

  return 'Ein unbekannter Fehler ist aufgetreten.';
}

// Error logging utility
export function logError(error: unknown, context?: Record<string, unknown>): void {
  const timestamp = new Date().toISOString();
  const errorInfo = {
    timestamp,
    ...(error instanceof Error
      ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
          ...(isAppError(error) && {
            code: error.code,
            statusCode: error.statusCode,
          }),
        }
      : { error: String(error) }),
    context,
  };

  // In production, this would send to a logging service
  console.error('[ERROR]', JSON.stringify(errorInfo, null, 2));

  // TODO: Send to error tracking service (e.g., Sentry)
  // if (process.env.NODE_ENV === 'production') {
  //   Sentry.captureException(error, { extra: context });
  // }
}

// Async error wrapper for better error handling
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  errorMessage: string = 'Operation fehlgeschlagen'
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    logError(error, { errorMessage });

    if (isAppError(error)) {
      throw error;
    }

    if (error instanceof Error) {
      throw new AppError(errorMessage, 'OPERATION_FAILED', 500);
    }

    throw new AppError(errorMessage, 'UNKNOWN_ERROR', 500);
  }
}
