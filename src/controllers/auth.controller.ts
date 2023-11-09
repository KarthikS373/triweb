import internalServerError from '../errors/internal-server.error';
import { loginService, registerService } from '../services/auth.service';

export const login = async (req: any, res: any, next: any): Promise<void> => {
  try {
    const { header, payload, signature } = req.body;

    const result = await loginService({
      header,
      payload,
      signature,
    });
    res.status(200).json(result);
  } catch (error: any) {
    next(internalServerError('something went wrong', error));
  }
};

export const register = async (req: any, res: any, next: any): Promise<void> => {
  try {
    const { header, payload, signature } = req.body;

    const result = await registerService({
      header,
      payload,
      signature,
    });
    res.status(200).json(result);
  } catch (error: any) {
    next(internalServerError('something went wrong', error));
  }
};

