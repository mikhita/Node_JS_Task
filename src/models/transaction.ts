import mongoose, { Schema, Document } from 'mongoose';
import { ICategory } from './category';
import { UserDoc } from './user';


export interface ITransaction extends Document {
  description: string;
  amount: number;
  date: Date;
  type: 'expense' | 'income';
  status: 'processing' | 'completed';
  category: Schema.Types.ObjectId[] | ICategory[];
  user: Schema.Types.ObjectId | UserDoc;
}

const transactionSchema: Schema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['expense', 'income'],
    required: true
  },
  status: {
    type: String,
    enum: ['processing', 'completed'],
    default: 'completed'
  },
  category: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});


transactionSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash
  }
});

const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);

export default Transaction;
