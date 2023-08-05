import { object, TypeOf, z } from 'zod';

export const verifySignatureInput = object({
  header: object({
    t: z.string({ required_error: 'Header t is required' }),
  }),
  payload: object({
    domain: z.string({ required_error: 'Domain is required' }),
    address: z.string({ required_error: 'Address is required' }),
    statement: z.string({ required_error: 'Statement is required' }),
    uri: z.string({ required_error: 'URI is required' }).url({
      message: 'URI is not valid',
    }),
    version: z.string({ required_error: 'Version is required' }),
    chainId: z.union([z.string(), z.number()], {
      required_error: 'ChainId is required',
    }),
    nonce: z.string({ required_error: 'Nonce is required' }),
    expirationTime: z
      .string({
        required_error: 'Expiration time is required',
      })
      .refine(value => new Date(value).getTime() > 0, {
        message: 'Expiration time  must be a valid date',
      }),
    issuedAt: z.string({ required_error: 'Issued at is required' }).refine(value => new Date(value).getTime() > 0, {
      message: 'Issued at must be a valid date',
    }),
    publicKey: z.string().optional(),
    bech32Prefix: z.string().optional(),
  }),
  signature: z.string({ required_error: 'Signature is required' }),
}).refine(
  value => {
    const expirationTime = new Date(value.payload.expirationTime);
    const now = new Date();
    return getUTCDate(now) <= getUTCDate(expirationTime);
  },
  {
    message: 'Signature has expired',
  },
);

export const getUTCDate = (date: Date): Date => {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
    ),
  );
};

export type VerifySignatureInput = TypeOf<typeof verifySignatureInput>;

