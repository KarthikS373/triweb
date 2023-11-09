import mongoose, { Date, Document, Model } from 'mongoose';

import type { IOrganization } from './organization.schema';
import type { IUser } from './user.schema';

export interface ISurvey extends Document {
  user: IUser['_id'];
  name: string;
  endDate?: Date;
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
  endDate: {
    type: mongoose.Schema.Types.Date,
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
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: false,
  },
});

const Survey: Model<ISurvey> = mongoose.model<ISurvey, ISurveyModel>('Survey', surveySchema);

export default Survey;
