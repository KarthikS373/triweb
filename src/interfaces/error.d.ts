interface ResponseError extends Error {
  code: string;
  status?: number;
  message: string;
}
