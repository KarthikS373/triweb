import { Router } from 'express';

import { createSurvey, updateSurvey, healthCheck } from '../controllers/survey.controller';

const router = Router();

/*
 * GET: /api/survey
 * @title Health check endpoint
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next function.
 */
router.get('/', healthCheck);

/*
 * POST: /api/survey/create
 * @title Create a new survey
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next function.
 * @throws {InternalServerError} - Failed generating health report
 * @throws {ValidationError} - Failed creating survey
 *
 * Sample response body:
 *   "data": {
 *    "folderName": "",
 *    "cid": ""
 *   }
 *
 * Sample request body:
 *  "title": "Survey Title",
 *  "description": "Survey Description",
 *  "questions": [
 *       {
 *           "question": "Question 1",
 *           "type": "text",
 *          "required": true
 *      },
 *      {
 *          "question": "Question 2",
 *          "type": "text",
 *          "required": true
 *      }
 *  ],
 *  "metadata": {
 *  "key": "value",
 *  "end_date": ""
 *  }
 */
router.post('/create', createSurvey);

router.post('/update', updateSurvey);

export default router;
