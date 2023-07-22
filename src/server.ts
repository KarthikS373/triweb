import mongoose from 'mongoose';

import { createServer } from 'http';

import app from './configs/app';
import env from './configs/env';
import logger from './configs/logger';
import unexpectedErrorHandler from './utils/error-handling/unexpected-error-handler';

const server = createServer(app);

mongoose.connect(env.mongoose.url).then(async () => {
  logger.info(`Connected to database`);

  server.listen(env.port, () => {
    logger.info(`Server started at ${env.base.url} on port ${env.port}`);
  });
});

process.on('uncaughtException', error => unexpectedErrorHandler(server, error));
process.on('unhandledRejection', error => unexpectedErrorHandler(server, error));
