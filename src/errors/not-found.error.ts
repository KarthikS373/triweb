class NotFoundError extends Error {
  public code: string;
  public status: number;

  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
    this.code = 'NOT_FOUND';
    this.status = 404;
  }
}

const notFoundError = (message: string): NotFoundError => {
  return new NotFoundError(message);
};

export default notFoundError;
