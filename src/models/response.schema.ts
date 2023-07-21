import mongoose, { Document, Model } from 'mongoose';

import type { ISurvey } from './survey.schema';
import type { IUser } from './user.schema';

export interface IResponse extends Document {
  survey: ISurvey['_id'];
  user: IUser['_id'];
  responseCID: string;
}

interface IResponseModel extends Model<IResponse> {}

const responseSchema = new mongoose.Schema<IResponse>({
  survey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Survey',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  responseCID: {
    type: String,
    required: true,
  },
});

const Response: Model<IResponse> = mongoose.model<IResponse, IResponseModel>('Response', responseSchema);

export default Response;

