import axios from 'axios';

import { debug } from '../../configs/logger';

const retrieveFileFromWeb3Storage = async (cid: string): Promise<any> => {
  const ipfsGatewayUrl = `https://ipfs.io/ipfs/${cid}`;

  const response = await axios.get(ipfsGatewayUrl);

  if (response.status !== 200) {
    throw new Error('Failed to fetch file from Web3 Storage');
  }

  const jsonData = response.data;

  debug(`Retrieved file from Web3 Storage: ${cid}`);

  return jsonData;
};

export default retrieveFileFromWeb3Storage;

