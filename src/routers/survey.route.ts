import { Router } from 'express';

import {
  createSurvey,
  getAllAvailableSurveys,
  getAllSurveys,
  getSurveyById,
  getSurveysByOrganization,
  healthCheck,
  updateSurvey,
} from '../controllers/survey.controller';

const router = Router();

/*
 * GET: /api/survey
 * @title Health check endpoint
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next function.
 */
router.get('/health', healthCheck);

/*
 * GET: /api/survey/
 * @title Get all surveys of a particular user
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next function.
 * @throws {InternalServerError} - Failed generating health report
 * @throws {ValidationError} - Failed creating survey
 *
 * Sample request query:
 *  "metadata": "true" | "false" (optional)
 *  "questions": "true" | "false" (optional)
 *
 * Sample response body:
 *  "data": {
 *      "surveys": [
 *      {
 *          "id": "",
 *          "user": {
 *              "id": "",
 *              "name": "",
 *              "address": ""
 *          },
 *          "name": "",
 *          "metadataCID": "",
 *          "questionsCID": "",
 *          "metadata": {
 *              "title": "",
 *              "slug": "",
 *              "description": "",
 *              "creator": "",
 *              "creatorAddress": "",
 *              "key": "",
 *              "endTime": ""
 *          },
 *          "questions": [
 *          {
 *              "question": "",
 *              "type": "",
 *              "required": true | false
 *          },
 *          {
 *              "question": "",
 *              "type": "",
 *              "required": true | false
 *          }
 *          ]
 *      }
 *   ]
 */
router.get('/', getAllSurveys);

/*
 * GET: /api/survey/all
 * @title Get all surveys
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next function.
 * @throws {InternalServerError} - Failed generating health report
 * @throws {ValidationError} - Failed creating survey
 *
 * Sample request query:
 *  "metadata": "true" | "false" (optional)
 *  "questions": "true" | "false" (optional)
 *
 * Sample response body:
 *  "data": {
 *      "surveys": [
 *      {
 *          "id": "",
 *          "user": {
 *              "id": "",
 *              "name": "",
 *              "address": ""
 *          },
 *          "name": "",
 *          "metadataCID": "",
 *          "questionsCID": "",
 *          "metadata": {
 *              "title": "",
 *              "slug": "",
 *              "description": "",
 *              "creator": "",
 *              "creatorAddress": "",
 *              "key": "",
 *              "endTime": ""
 *          },
 *          "questions": [
 *          {
 *              "question": "",
 *              "type": "",
 *              "required": true | false
 *          },
 *          {
 *              "question": "",
 *              "type": "",
 *              "required": true | false
 *          }
 *          ]
 *      }
 *   ]
 */
router.get('/all', getAllAvailableSurveys);

/*
 * GET: /api/survey/:id
 * @title Get a survey by id
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next function.
 * @throws {InternalServerError} - Failed generating health report
 * @throws {ValidationError} - Failed creating survey
 *
 * Sample request query:
 *  responses: "true" | "false" (optional)
 *
 * Sample response body:
 * "data": {
 *      "survey": {
 *          "id": "",
 *          "user": {
 *              "id": "",
 *              "name": "",
 *              "address": ""
 *          },
 *          "name": "",
 *          "metadataCID": "",
 *          "questionsCID": "",
 *          "metadata": {
 *              "title": "",
 *              "slug": "",
 *              "description": "",
 *              "creator": "",
 *              "creatorAddress": "",
 *              "key": "",
 *              "endTime": ""
 *          },
 *          "questions": [
 *          {
 *              "question": "",
 *              "type": "",
 *              "required": true | false
 *          },
 *          {
 *              "question": "",
 *              "type": "",
 *              "required": true | false
 *          }
 *          ]
 *      }
 */
router.get('/:id', getSurveyById);

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
 *       "survey": {
 *       "user": "",
 *       "name": "",
 *       "metadataCID": "",
 *       "questionsCID": "",
 *       "_id": "",
 *       },
 *       "metadata": {
 *       "title": "",
 *       "slug": "",
 *       "description": "",
 *       "creator": "",
 *       "creatorAddress": "",
 *       "key": "",
 *       "endTime": ""
 *       },
 *       "creator": ""
 *   },
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

/*
 * POST: /api/survey/update
 * @title Update the survey metadata
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next function.
 * @throws {InternalServerError} - Failed generating health report
 * @throws {ValidationError} - Failed creating survey
 *
 * Sample request body:
 *   "title": "Survey Title",
 *   "description": "Survey Description",
 *   "metadata": {
 *      "key": "value",
 *      "end_date": ""
 *   }
 *
 * Sample response body:
 *  "data": {
 *      "survey": {
 *         "user": "",
 *         "name": "",
 *         "metadataCID": "",
 *         "questionsCID": "",
 *         "_id": "",
 *       },
 *     "metadata": {
 *        "title": "",
 *        "slug": "",
 *        "description": "",
 *        "creator": "",
 *        "creatorAddress": "",
 *     },
 *   },
 *
 */
router.post('/update', updateSurvey);

router.get('/organizations', getSurveysByOrganization);

export default router;
