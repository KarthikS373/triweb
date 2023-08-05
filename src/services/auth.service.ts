import env from '../configs/env';
import { signPayload } from '../helpers/jwt';
import { verifySignature } from '../helpers/verifySignature';
import User from '../models/user.schema';

export const loginService = async (input: any): Promise<any> => {
  const { header, payload, signature } = input;

  const result = await verifySignature({
    header,
    payload,
    signature,
  });

  if (result === false) {
    throw new Error('Invalid signature');
  }

  const user = await User.findOne({ address: payload.address });

  if (user == null) {
    throw new Error('User not found');
  }

  const accessToken = signPayload({
    payload: {
      address: user.address,
    },
    privateKey: env.accessTokenPrivateKey,
    expiresIn: env.accessTokenExpiresIn,
  });

  return {
    accessToken,
    user,
  };
};

export const registerService = async (input: any): Promise<any> => {
  const { header, payload, signature } = input;

  const result = await verifySignature({
    header,
    payload,
    signature,
  });
  if (result === false) {
    throw new Error('Invalid signature');
  }

  const user = await User.create({
    address: payload.address,
    name: payload.address,
  });

  const accessToken = signPayload({
    payload: {
      address: user.address,
    },
    privateKey: env.accessTokenPrivateKey,
    expiresIn: env.accessTokenExpiresIn,
  });

  return {
    accessToken,
    user,
  };
};

