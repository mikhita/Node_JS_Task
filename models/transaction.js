const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
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

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;

