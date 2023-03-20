const transactionsRouter = require('express').Router()
const Transaction = require('../models/transaction')
const Category = require('../models/category')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

transactionsRouter.get('/', async (request, response) => {
  try {
    const transactions = await Transaction.find({})
      .populate('user', 'username name')
      .populate({
        path: 'category',
        select: 'name',
        model: 'Category'
      });

    response.json(transactions);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Server error' });
  }
});


transactionsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const { description, amount, category } = request.body
  const user = request.user

  if (!description || !amount || !category) {
    return response.status(400).json({ error: 'missing fields' })
  }

  const categoryObject = await Category.findById(category)

  if (!categoryObject) {
    return response.status(404).json({ error: 'category not found' })
  }
console.log(categoryObject)
  const transaction = new Transaction({
    description,
    amount,
    category: [categoryObject._id],
    user: user._id
  })

  const savedTransaction = await transaction.save()

  if (!user.transactions) {
    user.transactions = [];
  }
  

  user.transactions = user.transactions.concat(savedTransaction._id)
  await user.save()

  response.status(201).json(savedTransaction)
})

transactionsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const transaction = await Transaction.findById(request.params.id)
  if (!transaction) {
    return response.status(404).json({ error: 'transaction not found' })
  }

  if (transaction.user.toString() !== decodedToken.id.toString()) {
    return response.status(401).json({ error: 'only the user who added the transaction can delete it' })
  }

  await Transaction.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

transactionsRouter.put('/:id', middleware.userExtractor, async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const transaction = await Transaction.findById(request.params.id)
  if (!transaction) {
    return response.status(404).json({ error: 'transaction not found' })
  }

  if (transaction.user.toString() !== decodedToken.id.toString()) {
    return response.status(401).json({ error: 'only the user who added the transaction can modify it' })
  }

  const { description, amount, category } = request.body
  const categoryObject = await Category.findById(category)

  if (!categoryObject) {
    return response.status(404).json({ error: 'category not found' })
  }

  const updatedTransaction = {
    description: description || transaction.description,
    amount: amount || transaction.amount,
    category: categoryObject._id,
    user: decodedToken.id
  }

  const savedTransaction = await Transaction.findByIdAndUpdate(request.params.id, updatedTransaction, { new: true })
  response.json(savedTransaction)
})

module.exports = transactionsRouter
