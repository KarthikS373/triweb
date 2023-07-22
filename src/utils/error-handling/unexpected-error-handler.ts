import { Server } from 'http';

import logger from '../../configs/logger';

export const exitHandler = (server: Server) => {
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (server: Server, error: unknown) => {
  logger.error('An error occured:', error);
  exitHandler(server);
};

export default unexpectedErrorHandler;
