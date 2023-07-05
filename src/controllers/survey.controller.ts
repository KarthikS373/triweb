import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import InternalServerError from '../errors/internal-server.error';
import ValidationError from '../errors/validation.error';
import { surveySchema, updateSurveySchema } from '../schema/survey.schema';
import createWeb3StorageFolder from '../web3/web3storage/create-folder-with-data';
import updateSurveyFolder from '../web3/web3storage/update-folder';

/**
 * POST: /api/survey/create
 * @title Create a new survey
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next function.
 * @throws {InternalServerError} - Failed generating health report
 * @throws {ValidationError} - Failed creating survey
 * @returns {Promise<void>}
 */
export const createSurvey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    surveySchema.parse(req.body);
    try {
      const { title, description, questions, metadata } = req.body;

      const surveyName = title.replace(/\s/g, '-').toLowerCase();

      const cid = await createWeb3StorageFolder(
        surveyName,
        { title: title, description: description, ...metadata },
        questions,
      );

      if (!cid) {
        next(InternalServerError('Failed generating survey', null));
      }

      res.status(200).json({
        message: 'Survey created successfully',
        data: {
          folderName: surveyName,
          cid: cid,
        },
        error: null,
      });
    } catch (error) {
      next(InternalServerError('Failed generating a new survey', error));
    }
  } catch (error: any) {
    if (error instanceof ZodError) {
      next(ValidationError(error));
    }
    next(InternalServerError('Failed creating survey', error));
  }
};

/**
 * POST: /api/survey/update
 * @title Update a new survey
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next function.
 * @throws {InternalServerError} - Failed generating health report
 * @throws {ValidationError} - Failed creating survey
 * @returns {Promise<void>}
 */
export const updateSurvey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    updateSurveySchema.parse(req.body);
    try {
      const { title, description, questions, metadata, cid } = req.body;

      const surveyName = title.replace(/\s/g, '-').toLowerCase();

      await updateSurveyFolder(cid, surveyName, {
        title: title,
        description: description,
        ...metadata,
      });

      if (!cid) {
        next(InternalServerError('Failed updating survey', null));
      }

      res.status(200).json({
        message: 'Survey updated successfully',
        data: {
          folderName: surveyName,
          metadata: {
            title: title,
            description: description,
            ...metadata,
          },
        },
        error: null,
      });
    } catch (error) {
      next(InternalServerError('Failed generating a new survey', error));
    }
  } catch (error: any) {
    if (error instanceof ZodError) {
      next(ValidationError(error));
    }
    next(InternalServerError('Failed updating survey', error));
  }
};

