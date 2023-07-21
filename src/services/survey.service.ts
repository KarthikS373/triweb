import User, { IUser } from '../models/user.schema';
import Survey, { ISurvey } from '../models/survey.schema';
import Response, { IResponse } from '../models/response.schema';

import { fetchUserById } from './user.service';

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
    const user: IUser | null = await fetchUserById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const survey: ISurvey = await Survey.create({
      user: user._id,
      name: surveyName,
      description: description,
      metadataCID: metadata,
      questionsCID: question,
    });

    return survey;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to attach survey to user');
  }
};

