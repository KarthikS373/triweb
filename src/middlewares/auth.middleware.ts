import { Request, Response, NextFunction } from 'express';

const dummyUser = {
  _id: '64bad621deff9b3b8e5fd500',
  name: 'Developer',
  address: '0x80ee44eC09243ab38e2fc07f227254730965d9C1',
};

/**
 * Authentication middleware that sends a dummy user for testing purposes.
 *
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @param {express.NextFunction} next - The next middleware function.
 */
const isAuth = (req: Request, res: Response, next: NextFunction): void => {
  res.locals.user = dummyUser;

  next();
};

export default isAuth;
