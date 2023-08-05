import { SIWWeb3 } from '@web3auth/sign-in-with-web3';

import badRequestError from '../errors/bad-request.error';
import { VerifySignatureInput } from '../schema/auth';

export const verifySignature = async ({ header, payload, signature }: VerifySignatureInput): Promise<boolean> => {
  if (typeof payload.chainId === 'string') {
    throw badRequestError('ChainId must be a number for Ethereum');
  }
  const ethPayload = {
    ...payload,
    chainId: payload.chainId,
  };
  const message = new SIWWeb3({
    header,
    payload: ethPayload,
    network: 'ethereum',
  });
  return await message.verify(
    ethPayload,
    {
      s: signature,
      t: header.t,
    },
    'ethereum',
  );
};

