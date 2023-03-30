import mongoose, { Document } from 'mongoose';

interface IRecord extends Document {
  user: mongoose.Schema.Types.ObjectId;
  category: mongoose.Schema.Types.ObjectId[];
  transaction: mongoose.Schema.Types.ObjectId[];
}

const recordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  }],
  transaction: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    required: true
  }],
});

recordSchema.set('toJSON', {
  transform: (document: any, returnedObject: any) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

export default mongoose.model<IRecord>('Record', recordSchema);
