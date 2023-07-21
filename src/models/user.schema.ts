import mongoose, { Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  address: string;
}

interface IUserModel extends Model<IUser> {}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    unique: true,
  },
});

const User: Model<IUser> = mongoose.model<IUser, IUserModel>('User', userSchema);

export default User;

