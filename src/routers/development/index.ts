import { Router } from 'express';

import internalServerError from '../../errors/internal-server.error';
import User from '../../models/user.schema';

const router = Router();

router.post('/create-dummy-user', async (req, res, next) => {
  try {
    const user = await User.create({
      name: 'Developer',
      address: '0x80ee44eC09243ab38e2fc07f227254730965d9C1',
    });

    await user.save();

    res.status(200).json({
      message: 'Dummy user created',
      data: {
        user: user,
      },
      error: null,
    });
  } catch (error: any) {
    next(internalServerError('Failed generating a new survey', error));
  }
});

export default router;
