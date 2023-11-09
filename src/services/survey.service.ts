import Response, { IResponse } from '../models/response.schema';
import Survey, { ISurvey } from '../models/survey.schema';
import User, { IUser } from '../models/user.schema';

/**
 * @title Fetch all surveys
 * @returns {Promise<ISurvey[]>} - All surveys
 * @throws {Error} - Failed to fetch all surveys
 */
export const fetchAllSurveys = async (): Promise<ISurvey[]> => {
  try {
    const surveys: ISurvey[] = await Survey.find().populate('user').exec();
    return surveys;
  } catch (error: any) {
    throw new Error('Failed to fetch all surveys');
  }
};

/**
 * @title Fetch all surveys
 * @returns {Promise<ISurvey[]>} - All surveys
 * @throws {Error} - Failed to fetch all surveys
 */
export const fetchAllSurveysFromUser = async ({ userId }: { userId: string }): Promise<ISurvey[]> => {
  try {
    const surveys: ISurvey[] = await Survey.find({
      user: userId,
    })
      .populate('user')
      .exec();
    return surveys;
  } catch (error: any) {
    throw new Error('Failed to fetch all surveys');
  }
};

/*
 * @title Fetch a survey by ID
 * @param {string} surveyId - The ID of the survey to fetch
 * @returns {Promise<ISurvey>} - The fetched survey
 * @throws {Error} - Failed to fetch survey
 */
export const fetchSurveyById = async (surveyId: string): Promise<ISurvey> => {
  try {
    const survey: ISurvey | null = await Survey.findById(surveyId).populate('user').exec();

    if (!survey) {
      throw new Error('Survey not found');
    }

    return survey;
  } catch (error: any) {
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
  endDate: string,
  metadata: string,
  question: string,
  description?: string,
  organization?: string,
): Promise<ISurvey> => {
  try {
    const survey: ISurvey = await Survey.create({
      user: userId,
      name: surveyName,
      endDate: endDate,
      description: description,
      metadataCID: metadata,
      questionsCID: question,
      organization: organization,
    });

    return survey;
  } catch (error: any) {
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
  } catch (error: any) {
    throw new Error('Failed to update survey');
  }
};

/**
 * @title Delete a survey
 * @param {string} surveyId - The ID of the survey to delete
 * @returns {Promise<ISurvey>} - The deleted survey
 * @throws {Error} - Failed to delete survey
 * @throws {Error} - Survey not found
 */
export const deleteSurveyById = async (surveyId: string): Promise<ISurvey> => {
  try {
    const survey: ISurvey | null = await Survey.findByIdAndDelete(surveyId);

    if (!survey) {
      throw new Error('Survey not found');
    }
    return survey;
  } catch (error: any) {
    throw new Error('Failed to delete survey');
  }
};

/**
 * @title Fetch all surveys from a organization
 * @param {string} organizationId - The ID of the organization to fetch the surveys from
 * @returns {Promise<ISurvey[]>} - All surveys from the organization
 */
export const fetchAllSurveysFromOrganization = async (organizationId: string): Promise<ISurvey[]> => {
  try {
    const surveys: ISurvey[] = await Survey.find({
      organization: organizationId,
    })
      .populate('user')
      .exec();

    if (!surveys) {
      throw new Error('Surveys not found');
    }

    return surveys;
  } catch (error: any) {
    throw new Error('Failed to fetch all surveys from organization');
  }
};
