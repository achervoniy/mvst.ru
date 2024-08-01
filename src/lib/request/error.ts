export class ApiError {
  code: string;
  message: string;
  error: string[];

  constructor({ code, message, error }: { code: string; message: string; error?: string[] }) {
    this.code = String(code);
    this.message = message;
    this.error = error ?? [];
  }

  toString() {
    return 'error';
  }
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  return new ApiError({
    // @ts-ignore
    code: error.code,
    // @ts-ignore
    message: error.message,
  });
}

