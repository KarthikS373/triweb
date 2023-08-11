import mongoose, { Document, Model } from 'mongoose';

import type { IOrganization } from './organization.schema';
import type { IUser } from './user.schema';

export interface ISurvey extends Document {
  user: IUser['_id'];
  name: string;
  description?: string;
  metadataCID: string;
  questionsCID: string;
  organization?: IOrganization['_id'];
}

type ISurveyModel = Model<ISurvey>;

const surveySchema = new mongoose.Schema<ISurvey>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    minlength: 5,
  },
  description: {
    type: String,
    required: false,
    minlength: 10,
  },
  metadataCID: {
    type: String,
    required: true,
  },
  questionsCID: {
    type: String,
    required: true,
  },
});

const Survey: Model<ISurvey> = mongoose.model<ISurvey, ISurveyModel>('Survey', surveySchema);

export default Survey;
