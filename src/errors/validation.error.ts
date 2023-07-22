import { ZodError } from 'zod';

class ValidationError extends Error {
  public code: string;
  public status: number;

  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
    this.code = 'VALIDATION_ERROR';
    this.status = 400;
  }
}

const validationError = (error: ZodError): ValidationError => {
  const message = error?.errors?.map(err => err.message).join(', ');

  return new ValidationError(message);
};

export default validationError;
