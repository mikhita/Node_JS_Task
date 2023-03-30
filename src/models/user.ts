import mongoose, { Document, Model, Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { ICategory } from './category';
import { ITransaction } from './transaction';

export interface UserDoc extends Document {
  username: string;
  name?: string;
  email: string;
  passwordHash?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  categories?: Array<ICategory['_id']>;
  transaction?: Array<ITransaction['_id']>;
}

export interface UserModel extends Model<UserDoc> {}

const userSchema = new Schema<UserDoc>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    transaction: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
      },
    ],
  },
  { timestamps: true }
);

userSchema.plugin(uniqueValidator);

userSchema.set('toJSON', {
  transform: (document: UserDoc, returnedObject: UserDoc) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export default User;
