import User, { IUser } from '../models/user.schema';
import Survey, { ISurvey } from '../models/survey.schema';
import Response, { IResponse } from '../models/response.schema';

/**
 * @title Fetch user by ID
 * @param {string} userId - The ID of the user to fetch
 * @returns {Promise<IUser>} - The fetched user
 * @throws {Error} - Failed to fetch user
 */
export const fetchUserById = async (userId: string): Promise<IUser> => {
  try {
    const user: IUser | null = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error: any) {
    throw new Error('Failed to fetch user');
  }
};

