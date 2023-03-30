import mongoose, { Schema, Document, Model } from 'mongoose';
import { UserDoc } from './user';
import { ITransaction } from './transaction';

export interface ICategory extends Document {
  category_name: string;
  user: UserDoc['_id'];
  transaction: Array<ITransaction['_id']>;
  isDefault: boolean;
}

const categorySchema: Schema = new Schema({
  category_name: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  transaction: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }],
  isDefault: {
    type: Boolean,
    default: false
  }
});

categorySchema.set('toJSON', {
  transform: (document: Document, returnedObject: ICategory) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Category: Model<ICategory> = mongoose.model<ICategory>('Category', categorySchema);

export default Category;
