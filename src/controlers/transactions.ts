import { Router, Request, Response } from 'express';
import { Document } from 'mongoose';
import jwt, { Jwt, JwtPayload, Secret } from 'jsonwebtoken';
import { userExtractor } from '../utils/middleware';
import Transaction, { ITransaction } from '../models/transaction';
import Category, { ICategory } from '../models/category';
import UserModel, { UserDoc } from '../models/user';
import { TransactionType } from '../types/transactionType';

interface AuthenticatedRequest extends Request {
  token?: string;
  user?: UserDoc;
}


export const transactionsRouter: Router = Router();

transactionsRouter.get('/', async (request: AuthenticatedRequest, response: Response) => {
  try {
    const transactions: Array<Document<ITransaction>> = await Transaction.find({})
      .populate('user', 'username name')
      .populate({
        path: 'category',
        select: 'category_name',
      });
    response.json(transactions);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Server error' });
  }
});

transactionsRouter.get('/expenses', userExtractor, async (request: AuthenticatedRequest, response: Response) => {
  if (!request.token) {
    return response.status(401).json({ error: 'token missing' });
  }

  const token = request.token.toString(); // Convert to string
  const decodedToken = jwt.verify(token, process.env.SECRET as Secret) as (Jwt & JwtPayload);

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }

  const transactions: Array<Document<ITransaction>> = await Transaction.find({ user: decodedToken.id, type: TransactionType.Expense });
  response.json(transactions);
});

transactionsRouter.get('/incomes', userExtractor, async (request: AuthenticatedRequest, response: Response) => {
  if (!request.token) {
    return response.status(401).json({ error: 'token missing' });
  }

  const token = request.token.toString(); // Convert to string
  const decodedToken = jwt.verify(token, process.env.SECRET as Secret) as (Jwt & JwtPayload);

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }

  const transactions: Array<Document<ITransaction>> = await Transaction.find({ user: decodedToken.id, type: TransactionType.Income });
  response.json(transactions);
});

transactionsRouter.get('/', async (request: AuthenticatedRequest, response: Response) => {
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

transactionsRouter.get('/expenses', userExtractor, async (request: AuthenticatedRequest, response: Response) => {
  if (!request.token) {
    return response.status(401).json({ error: 'token missing' });
  }

  const token = request.token.toString(); // Convert to string
  const decodedToken = jwt.verify(token, process.env.SECRET as Secret) as (Jwt & JwtPayload);

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }

  const transactions = await Transaction.find({ user: decodedToken.id, type: 'expense' });
  response.json(transactions);
});

transactionsRouter.get('/incomes', userExtractor, async (request: AuthenticatedRequest, response: Response) => {
  if (!request.token) {
    return response.status(401).json({ error: 'token missing' });
  }

  const token = request.token.toString(); // Convert to string
  const decodedToken = jwt.verify(token, process.env.SECRET as Secret) as (Jwt & JwtPayload);

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }

  const transactions = await Transaction.find({ user: decodedToken.id, type: 'income' });
  response.json(transactions);
});

transactionsRouter.get('/expense', userExtractor, async (request: AuthenticatedRequest, response: Response) => {
  if (!request.token) {
    return response.status(401).json({ error: 'token missing' });
  }

  const token = request.token.toString(); // Convert to string
  const decodedToken = jwt.verify(token, process.env.SECRET as Secret) as (Jwt & JwtPayload);

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

transactionsRouter.get('/status', userExtractor, async (request: AuthenticatedRequest, response: Response) => {
  if (!request.token) {
    return response.status(401).json({ error: 'token missing' });
  }

  const token = request.token.toString(); // Convert to string
  const decodedToken = jwt.verify(token, process.env.SECRET as Secret) as (Jwt & JwtPayload);

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }

  const transactions = await Transaction.find({ user: decodedToken.id, status: 'completed' });
  response.json(transactions);
});

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

transactionsRouter.get('/expenses', userExtractor, async (request: AuthenticatedRequest, response: Response) => {
  if (!request.token) {
    return response.status(401).json({ error: 'token missing' });
  }

  const token = request.token.toString(); // Convert to string
  const decodedToken = jwt.verify(token, process.env.SECRET as Secret) as (Jwt & JwtPayload);

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }

  const transactions = await Transaction.find({ user: decodedToken.id, type: 'expense' });
  response.json(transactions);
});

transactionsRouter.get('/incomes', userExtractor, async (request: AuthenticatedRequest, response: Response) => {
  if (!request.token) {
    return response.status(401).json({ error: 'token missing' });
  }

  const token = request.token.toString(); // Convert to string
  const decodedToken = jwt.verify(token, process.env.SECRET as Secret) as (Jwt & JwtPayload);

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }

  const transactions = await Transaction.find({ user: decodedToken.id, type: 'income' });
  response.json(transactions);
});

transactionsRouter.get('/expense', userExtractor, async (request: AuthenticatedRequest, response: Response) => {
  if (!request.token) {
    return response.status(401).json({ error: 'token missing' });
  }

  const token = request.token.toString(); // Convert to string
  const decodedToken = jwt.verify(token, process.env.SECRET as Secret) as (Jwt & JwtPayload);

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

transactionsRouter.get('/status', userExtractor, async (request: AuthenticatedRequest, response: Response) => {
  if (!request.token) {
    return response.status(401).json({ error: 'token missing' });
  }

  const token = request.token.toString(); // Convert to string
  const decodedToken = jwt.verify(token, process.env.SECRET as Secret) as (Jwt & JwtPayload);

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }

  const transactions = await Transaction.find({ user: decodedToken.id, status: 'completed' });
  response.json(transactions);
});


transactionsRouter.post('/', userExtractor, async (request: AuthenticatedRequest, response: Response) => {
  const { description, amount, category, type } = request.body;
  const user = request.user;

  if (!description || !amount || !type) {
    return response.status(400).json({ error: 'missing fields' });
  }

  let categoryObjects;
  if (!category || category.length === 0) {
    if (!user) {
      return response.status(401).json({ error: 'user is undefined' });
    }
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
  if (!user) {
    return response.status(401).json({ error: 'user is undefined' });
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
  if (!user) {
    return response.status(401).json({ error: 'user is undefined' });
  }
  if (!user.transaction) {
    if (!user) {
      return response.status(401).json({ error: 'user is undefined' });
    }
    user.transaction = [];
  }
  if (!user) {
    return response.status(401).json({ error: 'user is undefined' });
  }
  user.transaction = user.transaction.concat(savedTransaction._id);
  if (!user) {
    return response.status(401).json({ error: 'user is undefined' });
  }
  await user.save();

  response.status(201).json(savedTransaction);
});

transactionsRouter.delete('/:id', userExtractor, async (request: AuthenticatedRequest, response: Response) => {
  if (typeof request.token !== 'string') {
    return response.status(401).json({ error: 'Token missing or invalid' });
  }
  
  const decodedToken: any = jwt.verify(request.token, process.env.SECRET as Secret);
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }

  const transaction = await Transaction.findById(request.params.id);
  if (!transaction) {
    return response.status(404).json({ error: 'transaction not found' });
  }

  if (transaction.user.toString() !== decodedToken.id.toString()) {
    return response.status(401).json({ error: 'only the user who added the transaction can delete it' });
  }

  await Transaction.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

transactionsRouter.put('/:id', userExtractor, async (request: AuthenticatedRequest, response: Response) => {
  if (!request.token) {
    return response.status(401).json({ error: 'token missing' });
  }

  const token = request.token.toString(); // Convert to string
  const decodedToken = jwt.verify(token, process.env.SECRET as Secret) as (Jwt & JwtPayload);
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }

  const transaction = await Transaction.findById(request.params.id);
  if (!transaction) {
    return response.status(404).json({ error: 'transaction not found' });
  }

  if (transaction.user.toString() !== decodedToken.id.toString()) {
    return response.status(401).json({ error: 'only the user who added the transaction can modify it' });
  }

  const { description, amount, category } = request.body;
  const categoryObject = await Category.findById(category);

  if (!categoryObject) {
    return response.status(404).json({ error: 'category not found' });
  }

  const updatedTransaction = {
    description: description || transaction.description,
    amount: amount || transaction.amount,
    category: categoryObject._id,
    user: decodedToken.id
  };

  const savedTransaction = await Transaction.findByIdAndUpdate(request.params.id, updatedTransaction, { new: true });
  response.json(savedTransaction);
});


