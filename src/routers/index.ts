import { Router } from 'express';

import healthRouter from './health.route';
import surveyRouter from './survey.route';

const router = Router();

router.use('/health', healthRouter);
router.use('/survey', surveyRouter);

export default router;

