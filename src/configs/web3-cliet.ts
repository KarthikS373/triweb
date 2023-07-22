import { Web3Storage } from 'web3.storage';

import env from './env';

const client = new Web3Storage({ token: env.web3Storage.apiToken });

export default client;
