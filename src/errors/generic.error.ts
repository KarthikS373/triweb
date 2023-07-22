class GenericError extends Error {
  public code: string;
  public cause: any;
  public status: number;

  constructor(message: string, name: string, code: string, status: number, error: any) {
    super(message);
    this.name = name;
    this.code = code;
    this.cause = error;
    this.status = status;
  }
}

const genericError = (message: string, name: string, code: string, status: number, error: any): GenericError => {
  return new GenericError(message, name, code, status, error);
};

export default genericError;
