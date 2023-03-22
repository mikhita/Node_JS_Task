const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  amount: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  category: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  completed: {
    type: Boolean,
    default: false
  },
  processed: {
    type: Boolean,
    default: false
  }
});

transactionSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;

