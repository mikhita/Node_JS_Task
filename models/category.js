const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
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
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  },
})


module.exports = mongoose.model('Category', categorySchema)