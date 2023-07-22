import winston from 'winston';

import env from './env';

const isDevelopmentEnv = env.env === 'development';

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level}: ${message}`;
    }),
  ),
});

export const debug = (message: string): void => {
  if (isDevelopmentEnv) {
    logger.info(message);
  }
};

export const routeLogger = (req: any, res: any, next: any): void => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
};

export default logger;
