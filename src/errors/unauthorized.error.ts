class UnauthorizedError extends Error {
  public code: string;
  public status: number;

  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
    this.code = 'UNAUTHORIZED';
    this.status = 401;
  }
}

const unauthorizedError = (message: string): UnauthorizedError => {
  return new UnauthorizedError(message);
};

export default unauthorizedError;
