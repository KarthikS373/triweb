import { NextFunction, Request, Response } from 'express';

import logger from '../../configs/logger';
import genericError from '../../errors/generic.error';

/**
 * @title Error Converter
 * @dev Converts non-Error objects to Error objects and sets the status code.
 * @param {{ status: number; message: string, code: string }} error - The error object.
 * @throws {Error} If there is an error during the conversion process.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function.
 */
export const errorConverter = (
  error: Error & { status: number; message: string; code: string; cause: any },
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const message = error.message ? error.message : 'An error occurred while processing your request...';
  const statusCode = error.status ? error.status : 500;

  try {
    next(genericError(message, error.name, error.code, statusCode, error.cause ?? undefined));
  } catch (error) {
    next(error);
  }
};

/**
 * @title Error Handler
 * @dev Handles and sends an error response with the appropriate status code and message.
 * @param {{ status: number; message: string, code: string }} error - The error object.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function.
 */
export const errorHandler = (
  error: { status: number; message: string; code: string },
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error(`${error.code}:${error.status} - ${error.message}`);

  return res.status(error.status).json({
    message: error.message,
    error: error,
    data: null,
  });
};
