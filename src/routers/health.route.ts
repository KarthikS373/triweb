import { Router } from 'express';

import { isAuth } from './../middlewares/auth.middleware';

import { getHealth } from '../controllers/health.controller';

const router = Router();

router.get('/', isAuth, getHealth);

export default router;
