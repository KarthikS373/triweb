import { Router } from 'express';

import { addResponse } from '../controllers/response.controller';

const router = Router();

/*
 * POST: /api/response/add
 * @title
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next function.
 * @throws {InternalServerError} - Failed generating health report
 * @throws {ValidationError} - Failed creating survey
 *
 * Sample response body:
 *   "data": {
 *
 *   }
 *
 * Sample request body:
 *  "survey": "Survey ID",
 *  "user": "User ID",
 *  "response": [
 *     {
 *       "question": "Question 1",
 *       "response": "Response 1"
 *     },
 *     {
 *       "question": "Question 2",
 *       "response": "Response 2"
 *     }
 *  ]
 */
router.post('/add', addResponse);

export default router;

