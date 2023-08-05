import { sign, verify } from 'jsonwebtoken';

export interface JwtPayload {
  address: string;
}

export const signPayload = ({
  payload,
  privateKey,
  expiresIn,
}: {
  payload: JwtPayload;
  privateKey: string;
  expiresIn: string;
}): string => {
  const encodedPrivateKey = Buffer.from(privateKey, 'base64').toString('ascii');
  return sign(payload, encodedPrivateKey, {
    algorithm: 'RS256',
    expiresIn,
  });
};

export const verifyPayload = ({ token, publicKey }: { token: string; publicKey: string }): JwtPayload | null => {
  const encodedPublicKey = Buffer.from(publicKey, 'base64').toString('ascii');
  try {
    const payload = verify(token, encodedPublicKey, {
      algorithms: ['RS256'],
    });
    return payload as JwtPayload;
  } catch (e) {
    return null;
  }
};

