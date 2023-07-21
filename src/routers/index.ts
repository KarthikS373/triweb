import { Router } from 'express';

import isAuth from '../middlewares/auth.middleware';

import developmentRouter from './development';
import healthRouter from './health.route';
import surveyRouter from './survey.route';
import responseRouter from './response.route';

import { routeLogger } from '../configs/logger';

const router = Router();

// Logger
router.use(routeLogger);

router.use('/health', healthRouter);
router.use('/survey', isAuth, surveyRouter);
router.use('/response', isAuth, responseRouter);

// Development only routes
if (process.env.NODE_ENV === 'development') {
  router.use('/dev', developmentRouter);
}

export default router;

