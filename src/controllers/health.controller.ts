import { NextFunction, Request, Response } from 'express';

import internalServerError from '../errors/internal-server.error';

/**
 * GET: Check the server health
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next function.
 * @returns {Promise<void>}
 */
export const getHealth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.status(200).json({
      message: 'Server is healthy',
      data: {
        status: 'OK',
        uptime: process.uptime(),
        timestamp: Date.now(),
      },
      error: null,
    });
  } catch (error) {
    next(internalServerError('Failed generating health report', error));
  }
};
