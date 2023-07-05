import { File } from 'web3.storage';

import client from '../../configs/web3-cliet';

const createWeb3StorageFolder = async (
  folderName: string,
  metadata: Record<string, any>,
  questions: Record<string, any>,
) => {
  const metadataContent = JSON.stringify(metadata);
  const metadataFile = new File([metadataContent], 'metadata.json', { type: 'application/json' }).stream();

  const questionsContent = JSON.stringify(questions);
  const questionsFile = new File([questionsContent], 'questions.json', { type: 'application/json' }).stream();

  const files = [
    { name: `metadata.json`, stream: () => metadataFile },
    { name: `questions.json`, stream: () => questionsFile },
  ];

  const cid = await client.put(files, {
    name: folderName,
    wrapWithDirectory: true,
  });

  return cid;
};

export default createWeb3StorageFolder;

