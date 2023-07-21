import { NextFunction, Request, Response } from 'express';
import { CIDString } from 'web3.storage';
import { ZodError } from 'zod';

import InternalServerError from '../errors/internal-server.error';
import ValidationError from '../errors/validation.error';

import { debug } from '../configs/logger';
import { surveySchema, updateSurveySchema } from '../schema/survey.schema';
import { createSurveyWithMetadata } from '../services/survey.service';
import { fetchUserById } from '../services/user.service';
import addFileToWeb3Storage from '../web3/web3storage/add-file';
import updateSurveyFolder from '../web3/web3storage/update-folder';

/**
 * GET: /api/survey/
 * @title Health check endpoint
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next function.
 * @throws {InternalServerError} - Failed generating health report
 * @returns {Promise<void>}
 */
export const healthCheck = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.status(200).json({
      message: 'Survey service is up and running',
      data: {
        health: 'OK',
      },
      error: null,
    });
  } catch (error) {
    next(InternalServerError('Failed generating a new survey', error));
  }
};

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

      // TODO: Assuming auth middleware validates the user and attaches the user id
      const userId = res.locals.user._id;

      debug('Fetching survey creator details');
      const user = await fetchUserById(userId);

      const surveyName = title.replace(/\s/g, '-').toLowerCase();

      const metadataContent = {
        title: title,
        slug: surveyName,
        description: description,
        creator: user?.name,
        creatorAddress: user?.address,
        ...metadata,
      };

      let questionsCID: CIDString | null, metadataCID: CIDString | null;

      debug('Uploading survey content to web3.storage');
      try {
        questionsCID = await addFileToWeb3Storage(`${surveyName}-questions.json`, questions);
        metadataCID = await addFileToWeb3Storage(`${surveyName}-metadata.json`, metadataContent);
      } catch (error: any) {
        next(InternalServerError('Error uploading content', error));
        return;
      }

      if (!questionsCID || !metadataCID) {
        next(InternalServerError('Content upload failed', null));
      }

      debug('Creating survey record in database');
      const survey = await createSurveyWithMetadata(userId, surveyName, metadataCID, questionsCID);

      res.status(200).json({
        message: 'Survey created successfully',
        data: {
          survey: survey,
          metadata: metadataContent,
          creator: user?._id,
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

