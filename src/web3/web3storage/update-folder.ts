import { File } from 'web3.storage';

import ipfs from '../../configs/ipfs';

const updateSurveyFolder = async (cid: string, folderName: string, metadata: Record<string, any>): Promise<string> => {
  const metadataContent = JSON.stringify(metadata);
  const metadataFile = new File([metadataContent], 'metadata.json', { type: 'application/json' }).stream();

  return 'updated CID';
};

export default updateSurveyFolder;

