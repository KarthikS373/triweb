import mongoose, { Document, Model } from 'mongoose';

import { IUser } from './user.schema';

export interface IOrganization extends Document {
  name: string;
  description?: string;
  logo?: string;
  owner: IUser['_id'];
}

type IOrganizationModel = Model<IOrganization>;

const organizationSchema = new mongoose.Schema<IOrganization>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: false,
    trim: true,
  },
  logo: {
    type: String,
    required: false,
    trim: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Organization: Model<IOrganization> = mongoose.model<IOrganization, IOrganizationModel>(
  'Organization',
  organizationSchema,
);

export default Organization;

