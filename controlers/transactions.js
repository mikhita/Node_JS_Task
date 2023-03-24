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
        select: 'category_name'
      });
    response.json(transactions);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Server error' });
  }
});
transactionsRouter.get('/expenses', middleware.userExtractor, async (request, response) => {
  console.log('request.token:', request.token);
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  console.log('decodedToken:', decodedToken);
  
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }

  const transactions = await Transaction.find({ user: decodedToken.id, type: 'expense' });
  response.json(transactions);
});
transactionsRouter.get('/incomes', middleware.userExtractor, async (request, response) => {
  console.log('request.token:', request.token);
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  console.log('decodedToken:', decodedToken);
  
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }

  const transactions = await Transaction.find({ user: decodedToken.id, type: 'income' });
  response.json(transactions);
});


transactionsRouter.get('/expense', middleware.userExtractor, async (request, response) => {
  console.log('request.token:', request.token);
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  console.log('decodedToken:', decodedToken);
  
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }

  const minAmount = Number(request.query.minAmount);
  const maxAmount = Number(request.query.maxAmount);

  const transactions = await Transaction.find({ 
    user: decodedToken.id, 
    type: 'expense',
    amount: { $gte: minAmount, $lte: maxAmount }
  });

  response.json(transactions);
});

transactionsRouter.get('/status', middleware.userExtractor, async (request, response) => {
  console.log('request.token:', request.token);
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  console.log('decodedToken:', decodedToken);
  
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }

  const transactions = await Transaction.find({ user: decodedToken.id, status: 'completed' });
  response.json(transactions);
});


  
  



transactionsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const { description, amount, category, type } = request.body;
  const user = request.user;

  if (!description || !amount || !type) {
    return response.status(400).json({ error: 'missing fields' });
  }

  let categoryObjects;
  if (!category || category.length === 0) {
    categoryObjects = await Category.find({ user: user._id, isDefault: true });
    if (categoryObjects.length === 0) {
      return response.status(404).json({ error: 'default category not found' });
    }
  } else {
    categoryObjects = await Category.find({ _id: { $in: category } });
    if (categoryObjects.length !== category.length) {
      return response.status(404).json({ error: 'category not found' });
    }
  }

  const transaction = new Transaction({
    description,
    amount,
    type,
    category: categoryObjects.map((c) => c._id),
    user: user._id
  });

  const savedTransaction = await transaction.save();

  // Update the categories with the new transaction
  await Promise.all(categoryObjects.map((c) => Category.updateOne({ _id: c._id }, { $push: { transactions: transaction._id } })));

  if (!user.transaction) {
    user.transaction = [];
  }

  user.transaction = user.transaction.concat(savedTransaction._id);
  await user.save();

  response.status(201).json(savedTransaction);
});





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
