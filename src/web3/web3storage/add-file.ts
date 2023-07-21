import { CIDString, File } from 'web3.storage';

import client from '../../configs/web3-cliet';

const addFileToWeb3Storage = async (name: string, file: Record<string, any>): Promise<CIDString> => {
  const fileContent = JSON.stringify(file);
  const blob = [new File([fileContent], name, { type: 'application/json' })];

  const cid = await client.put(blob);

  return cid;
};

export default addFileToWeb3Storage;

