class BadRequestError extends Error {
  public code: string;
  public status: number;

  constructor(message: string) {
    super(message);
    this.name = 'BadRequestError';
    this.code = 'BAD_REQUEST';
    this.status = 400;
  }
}

const badRequestError = (message: string): BadRequestError => {
  return new BadRequestError(message);
};

export default badRequestError;
