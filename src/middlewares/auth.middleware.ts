import env from '../configs/env';
import { verifyPayload } from '../helpers/jwt';
import User from '../models/user.schema';

/**
 * Authentication middleware that sends a dummy user for testing purposes.
 *
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @param {express.NextFunction} next - The next middleware function.
 */
export const isAuth = async (req: any, res: any, next: any): Promise<void> => {
  try {
    let accessToken = null;
    if (req.headers.authorization?.startsWith('Bearer') === true) {
      accessToken = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.access_token != null) {
      accessToken = req.cookies.access_token;
    }

    if (accessToken == null) {
      res.status(401).send({ error: 'Unauthorized' });
      return;
    }

    // Validate Access Token
    const decoded = verifyPayload({
      token: accessToken,
      publicKey: env.accessTokenPublicKey,
    });

    if (decoded == null) {
      res.status(401).send({ error: 'Unauthorized' });
      return;
    }

    const user = await User.findOne({ address: decoded.address });

    if (user?.address === undefined ) {
      res.status(401).send({ error: 'Unauthorized' });
      return;
    }

    req.user = user;

    next();
  } catch (err: any) {
    res.status(401).send({ error: err });
  }
};
