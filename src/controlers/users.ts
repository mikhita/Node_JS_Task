import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User, { UserDoc } from '../models/user';

const usersRouter = Router();

usersRouter.post('/', async (request: Request, response: Response) => {
  const { username, name, email, password } = request.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user: UserDoc = new User({
    username,
    name,
    email,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

usersRouter.get('/', async (_: Request, response: Response) => {
  const users = await User
    .find({})
    .populate('categories', { category_name: 1 })
    .populate('transaction', { description: 1, amount: 1 });

  response.json(users);
});

export default usersRouter;
