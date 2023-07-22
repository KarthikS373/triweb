export interface APIType<T = any, P = Error> {
  message: string;
  data: T;
  error: P;
}
