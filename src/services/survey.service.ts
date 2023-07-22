import Response, { IResponse } from '../models/response.schema';
import Survey, { ISurvey } from '../models/survey.schema';
import User, { IUser } from '../models/user.schema';

/*
 * @title Fetch a survey by ID
 * @param {string} surveyId - The ID of the survey to fetch
 * @returns {Promise<ISurvey>} - The fetched survey
 * @throws {Error} - Failed to fetch survey
 */
export const fetchSurveyById = async (surveyId: string): Promise<ISurvey> => {
  try {
    const survey: ISurvey | null = await Survey.findById(surveyId);

    if (!survey) {
      throw new Error('Survey not found');
    }

    return survey;
  } catch (error) {
    throw new Error('Failed to fetch survey');
  }
};

/**
 * @title Create and attach a survey to a user
 * @param {string} userId - The ID of the user to attach the survey to
 * @param {string} surveyName - The name of the survey to create
 * @param {string} description - The description of the survey
 * @param {string} metadata - The CID of the survey
 * @param {string} question - The CID of the survey
 * @returns {Promise<ISurvey>} - The created survey
 * @throws {Error} - Failed to attach survey to user
 */
export const createSurveyWithMetadata = async (
  userId: string,
  surveyName: string,
  metadata: string,
  question: string,
  description?: string,
): Promise<ISurvey> => {
  try {
    const survey: ISurvey = await Survey.create({
      user: userId,
      name: surveyName,
      description: description,
      metadataCID: metadata,
      questionsCID: question,
    });

    return survey;
  } catch (error) {
    throw new Error('Failed to attach survey to user');
  }
};

/**
 * @title Update a survey metadata
 * @param {string} surveyId - The ID of the survey to update
 * @param {string} metadata - The CID of the survey
 * @returns {Promise<ISurvey>} - The updated survey
 * @throws {Error} - Failed to update survey
 * @throws {Error} - Survey not found
 */
export const updateSurveyMetadata = async (surveyId: string, metadata: string): Promise<ISurvey> => {
  try {
    const survey: ISurvey | null = await Survey.findByIdAndUpdate(surveyId, {
      metadataCID: metadata,
    });

    if (!survey) {
      throw new Error('Survey not found');
    }

    return survey;
  } catch (error) {
    throw new Error('Failed to update survey');
  }
};
