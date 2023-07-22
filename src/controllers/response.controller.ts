import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { debug } from '../configs/logger';
import InternalServerError from '../errors/internal-server.error';
import ValidationError from '../errors/validation.error';
import { ISurvey } from '../models/survey.schema';
import { IUser } from '../models/user.schema';
import { addResponseSchema, responseSchema } from '../schema/response.schema';
import { createResponse } from '../services/response.service';
import { fetchSurveyById } from '../services/survey.service';
import { fetchUserById } from '../services/user.service';
import addFileToWeb3Storage from '../web3/web3storage/add-file';

/**
 * POST: /api/response/add
 * @title Add a new response to a survey
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next function.
 * @throws {InternalServerError} - Failed generating health report
 * @throws {ValidationError} - Failed creating survey
 * @returns {Promise<void>}
 */
export const addResponse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { survey: surveyId, response: responses } = addResponseSchema.parse(req.body);
    try {
      // TODO: Assuming auth middleware validates the user and attaches the user id
      const userId = res.locals.user._id;

      debug('Fetching details from database');
      const survey: ISurvey | null = await fetchSurveyById(surveyId);
      const user: IUser | null = await fetchUserById(userId);

      if (!survey) {
        throw new Error('Survey not found');
      }

      if (!user) {
        throw new Error('User not found');
      }

      const surveyName = survey.name.replace(/\s/g, '-').toLowerCase();

      const responseArray = responses.map(response => {
        return responseSchema.parse(response);
      });

      const responseContent = {
        survey: {
          name: survey.name,
          description: survey.description,
        },
        user: {
          name: user.name,
          address: user.address,
        },
        response: responseArray,
      };

      let responseCID: string;

      debug('Uploading survey content to web3.storage');
      try {
        responseCID = await addFileToWeb3Storage(`${user.address}-${surveyName}-response.json`, responseContent);
      } catch (error: any) {
        next(InternalServerError('Error uploading content', error));
        return;
      }

      if (!responseCID) {
        next(InternalServerError('Content upload failed', null));
      }

      debug('Creating response record in database');
      const response = await createResponse(userId, surveyId, responseCID);

      res.status(200).json({
        message: 'Response added successfully',
        data: {
          cid: responseCID,
          response: response,
          content: responseContent,
          survey: survey,
        },
        error: null,
      });
    } catch (error: any) {
      next(InternalServerError(error.message, error));
    }
  } catch (error: any) {
    if (error instanceof ZodError) {
      next(ValidationError(error));
    }
    next(InternalServerError('Failed creating survey', error));
  }
};
