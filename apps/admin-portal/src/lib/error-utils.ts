/**
 * Extract error message from various error types
 */
export function getErrorMessage(error: unknown, fallback = 'Đã xảy ra lỗi'): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error && typeof error === 'object') {
    // Check for common error message fields (both lowercase and uppercase)
    const errorObj = error as Record<string, unknown>;

    // Backend uses uppercase "Message"
    if (errorObj.Message && typeof errorObj.Message === 'string') {
      return errorObj.Message;
    }

    if (errorObj.message && typeof errorObj.message === 'string') {
      return errorObj.message;
    }

    if (errorObj.Error && typeof errorObj.Error === 'string') {
      return errorObj.Error;
    }

    if (errorObj.error && typeof errorObj.error === 'string') {
      return errorObj.error;
    }

    if (errorObj.Title && typeof errorObj.Title === 'string') {
      return errorObj.Title;
    }

    if (errorObj.title && typeof errorObj.title === 'string') {
      return errorObj.title;
    }
  }

  return fallback;
}

