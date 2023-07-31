import Response, { IResponse } from '../models/response.schema';
import Survey, { ISurvey } from '../models/survey.schema';
import User, { IUser } from '../models/user.schema';

/**
 * Fetches a response by its ID.
 * @param {string} responseId - The ID of the response to fetch.
 * @returns {Promise<IResponse>} - The fetched response.
 * @throws {Error} - Failed to fetch the response or response not found.
 */
export const fetchResponseById = async (responseId: string): Promise<IResponse> => {
  try {
    const response: IResponse | null = await Response.findById(responseId);

    if (!response) {
      throw new Error('Response not found');
    }

    return response;
  } catch (error) {
    throw new Error('Failed to fetch the response');
  }
};

/**
 * Fetches all responses for a survey.
 * @param {string} surveyId - The ID of the survey for which the responses are fetched.
 * @returns {Promise<IResponse[]>} - The fetched response.
 * @throws {Error} - Failed to fetch the response or response not found.
 */
export const fetchResponsesBySurveyId = async (surveyId: string): Promise<IResponse[]> => {
  try {
    const responses: IResponse[] = await Response.find({ survey: surveyId }).populate('user').exec();

    return responses;
  } catch (error) {
    throw new Error('Failed to fetch the responses');
  }
};

/**
 * Creates and saves a new response.
 * @param {string} userId - The ID of the user who submitted the response.
 * @param {string} surveyId - The ID of the survey for which the response is created.
 * @param {string} responseCID - The CID of the response data stored in IPFS.
 * @returns {Promise<IResponse>} - The created response.
 * @throws {Error} - Failed to create the response.
 */
export const createResponse = async (userId: string, surveyId: string, responseCID: string): Promise<IResponse> => {
  try {
    const response: IResponse = await Response.create({
      survey: surveyId,
      user: userId,
      responseCID: responseCID,
    });

    return response;
  } catch (error) {
    throw new Error('Failed to create the response');
  }
};
