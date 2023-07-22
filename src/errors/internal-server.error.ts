class InternalServerError extends Error {
  public code: string;
  public cause: any;
  public status: number;

  constructor(message: string, error: any) {
    super(message);
    this.name = 'InternalServerError';
    this.code = 'INTERNAL_SERVER_ERROR';
    this.cause = error;
    this.status = 500;
  }
}

const internalServerError = (message: string, error: any): InternalServerError => {
  return new InternalServerError(message, error);
};

export default internalServerError;
