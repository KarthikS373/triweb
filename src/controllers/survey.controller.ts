import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { debug } from '../configs/logger';
import InternalServerError from '../errors/internal-server.error';
import unauthorizedError from '../errors/unauthorized.error';
import ValidationError from '../errors/validation.error';
import { getAllSurveySchema, getSurveyByIdSchema, surveySchema, updateSurveySchema } from '../schema/survey.schema';
import { fetchResponsesBySurveyId } from '../services/response.service';
import {
  createSurveyWithMetadata,
  fetchAllSurveys,
  fetchAllSurveysFromUser,
  fetchSurveyById,
  updateSurveyMetadata,
} from '../services/survey.service';
import { fetchUserById } from '../services/user.service';
import addFileToWeb3Storage from '../web3/web3storage/add-file';
import retrieveFileFromWeb3Storage from '../web3/web3storage/fetch-cid';

import type { IResponse, IQuestion, IResponseSurvey } from '../interfaces/response';
import type { CIDString } from 'web3.storage';

/**
 * GET: /api/survey/health
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
 * GET: /api/survey/all
 * @title Get all surveys
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next function.
 * @throws {InternalServerError} - Failed generating health report
 * @returns {Promise<void>}
 */
export const getAllAvailableSurveys = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { metadata, questions, responses } = getAllSurveySchema.parse(req.query);
    try {
      const surveys = await fetchAllSurveys();

      const formattedSurvey: IResponseSurvey[] = surveys.map(survey => {
        const surveyName = survey?.name?.replace(/\s/g, '-').toLowerCase();

        return {
          id: survey._id,
          user: {
            id: survey?.user?._id,
            name: survey?.user?.name,
            address: survey?.user?.address,
          },
          name: survey.name,
          slug: surveyName,
          metadataCID: survey.metadataCID,
          questionsCID: survey.questionsCID,
          metadata: null,
          questions: null,
          responses: null,
        };
      });

      for (const survey of formattedSurvey) {
        if (metadata === 'true') {
          const metadata = await retrieveFileFromWeb3Storage(`${survey.metadataCID}/${survey.slug}-metadata.json`);
          survey.metadata = metadata;
        }
        if (questions === 'true') {
          const questions = await retrieveFileFromWeb3Storage(`${survey.questionsCID}/${survey.slug}-questions.json`);
          survey.questions = questions;
        }
        if (responses === 'true') {
          const surveyResponses = await fetchResponsesBySurveyId(survey.id);
          const formattedResponses: IResponse[] = [];

          for (const response of surveyResponses) {
            const storredResponse = await retrieveFileFromWeb3Storage(
              `${response.responseCID}/${response?.user?.address}-${survey.slug}-response.json`,
            );

            const formattedResponse: IResponse = {
              id: response._id,
              responseCID: response.responseCID,
              response: storredResponse,
              user: {
                id: response?.user?._id,
                name: response?.user?.name,
                address: response?.user?.address,
              },
            };

            formattedResponses.push(formattedResponse);
          }

          survey.responses = formattedResponses;
        }
      }

      res.status(200).json({
        message: 'All surveys fetched successfully',
        data: {
          surveys: formattedSurvey,
        },
        error: null,
      });
    } catch (error) {
      next(InternalServerError('Failed fetching all surveys', error));
    }
  } catch (error) {
    if (error instanceof ZodError) {
      next(ValidationError(error));
    }

    next(InternalServerError('Failed fetching all surveys', error));
  }
};

/**
 * GET: /api/survey/
 * @title Get all surveys
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next function.
 * @throws {InternalServerError} - Failed generating health report
 * @returns {Promise<void>}
 */
export const getAllSurveys = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { metadata, questions, responses } = getAllSurveySchema.parse(req.query);
    try {
      const user = res.locals.user._id;

      if (!user) {
        next(Error('Unauthorized'));
      }

      debug('Fetching surveys of user: ' + user);
      const surveys = await fetchAllSurveysFromUser({ userId: user });
      debug("User's surveys: " + surveys);

      const formattedSurvey: IResponseSurvey[] = surveys.map(survey => {
        const surveyName = survey?.name?.replace(/\s/g, '-').toLowerCase();

        return {
          id: survey._id,
          user: {
            id: survey?.user?._id,
            name: survey?.user?.name,
            address: survey?.user?.address,
          },
          name: survey.name,
          slug: surveyName,
          metadataCID: survey.metadataCID,
          questionsCID: survey.questionsCID,
          metadata: null,
          questions: null,
          responses: null,
        };
      });

      for (const survey of formattedSurvey) {
        if (metadata === 'true') {
          const metadata = await retrieveFileFromWeb3Storage(`${survey.metadataCID}/${survey.slug}-metadata.json`);
          survey.metadata = metadata;
        }
        if (questions === 'true') {
          const questions = await retrieveFileFromWeb3Storage(`${survey.questionsCID}/${survey.slug}-questions.json`);
          survey.questions = questions;
        }
        if (responses === 'true') {
          const surveyResponses = await fetchResponsesBySurveyId(survey.id);
          const formattedResponses: IResponse[] = [];

          for (const response of surveyResponses) {
            const storredResponse = await retrieveFileFromWeb3Storage(
              `${response.responseCID}/${response?.user?.address}-${survey.slug}-response.json`,
            );

            const formattedResponse: IResponse = {
              id: response._id,
              responseCID: response.responseCID,
              response: storredResponse,
              user: {
                id: response?.user?._id,
                name: response?.user?.name,
                address: response?.user?.address,
              },
            };

            formattedResponses.push(formattedResponse);
          }

          survey.responses = formattedResponses;
        }
      }

      res.status(200).json({
        message: 'All surveys fetched successfully',
        data: {
          surveys: formattedSurvey,
        },
        error: null,
      });
    } catch (error) {
      next(InternalServerError('Failed fetching all surveys', error));
    }
  } catch (error) {
    if (error instanceof ZodError) {
      next(ValidationError(error));
    }

    next(InternalServerError('Failed fetching all surveys', error));
  }
};

/**
 * GET: /api/survey/:id
 * @title Get survey by id
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next function.
 * @throws {InternalServerError} - Failed generating health report
 * @returns {Promise<void>}
 */
export const getSurveyById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const { responses } = getSurveyByIdSchema.parse(req.query);

    try {
      const user = res.locals.user._id;
      debug('User: ' + user);

      if (!user) {
        next(unauthorizedError('Unauthorized'));
      }

      debug('Fetching survey: ' + id);
      const survey = await fetchSurveyById(id);
      debug('Survey: ' + survey);

      const areIdsEqual = survey?.user?._id.toString().localeCompare(user) === 0;
      debug(
        'Survey user verification: ' +
          JSON.stringify({ surveyUser: survey?.user?._id, user: user, verify: areIdsEqual }),
      );
      if (!areIdsEqual) {
        next(unauthorizedError('Unauthorized'));
      }

      const surveyName = survey?.name?.replace(/\s/g, '-').toLowerCase();

      const metadata = await retrieveFileFromWeb3Storage(`${survey.metadataCID}/${surveyName}-metadata.json`);
      const questions = await retrieveFileFromWeb3Storage(`${survey.questionsCID}/${surveyName}-questions.json`);

      const formattedSurvey: IResponseSurvey = {
        id: survey._id,
        user: {
          id: survey?.user?._id,
          name: survey?.user?.name,
          address: survey?.user?.address,
        },
        name: survey.name,
        slug: surveyName,
        metadataCID: survey.metadataCID,
        questionsCID: survey.questionsCID,
        metadata: metadata,
        questions: questions,
        responses: null,
      };

      if (responses === 'true') {
        const surveyResponses = await fetchResponsesBySurveyId(id);

        const formattedResponses: IResponse[] = [];

        for (const response of surveyResponses) {
          const storredResponse = await retrieveFileFromWeb3Storage(
            `${response.responseCID}/${response?.user?.address}-${surveyName}-response.json`,
          );

          const formattedResponse: IResponse = {
            id: response._id,
            responseCID: response.responseCID,
            response: storredResponse,
            user: {
              id: response?.user?._id,
              name: response?.user?.name,
              address: response?.user?.address,
            },
          };

          formattedResponses.push(formattedResponse);
        }

        formattedSurvey.responses = formattedResponses;
      }

      res.status(200).json({
        message: 'Survey fetched successfully',
        data: {
          survey: formattedSurvey,
        },
        error: null,
      });
    } catch (error) {
      next(InternalServerError('Failed fetching survey by id', error));
    }
  } catch (error) {
    if (error instanceof ZodError) {
      next(ValidationError(error));
    }

    next(InternalServerError('Failed fetching survey by id', error));
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
    const { title, description, questions, metadata } = surveySchema.parse(req.body);
    try {
      const userId = res.locals.user._id;

      if (!userId) {
        next(unauthorizedError('Unauthorized'));
      }

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
    const { id, description, metadata, title } = updateSurveySchema.parse(req.body);
    try {
      debug('Fetching survey details');
      const survey = await fetchSurveyById(id);
      const user = await fetchUserById(survey.user);

      const surveyName = (title ?? survey.name).replace(/\s/g, '-').toLowerCase();

      const metadataContent = {
        title: title,
        slug: surveyName,
        description: description,
        creator: user?.name,
        creatorAddress: user?.address,
        ...metadata,
      };

      let metadataCID: CIDString | null;

      debug('Uploading survey content to web3.storage');
      try {
        metadataCID = await addFileToWeb3Storage(`${surveyName}-metadata.json`, metadataContent);
      } catch (error: any) {
        next(InternalServerError('Error uploading content', error));
        return;
      }

      if (!metadataCID) {
        next(InternalServerError('Content upload failed', null));
      }

      debug('Updating survey record in database');
      await updateSurveyMetadata(survey.id, metadataCID);

      res.status(200).json({
        message: 'Survey updated successfully',
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
    next(InternalServerError('Failed updating survey', error));
  }
};
