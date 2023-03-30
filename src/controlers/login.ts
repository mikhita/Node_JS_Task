import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response, Router } from 'express';
import User from '../models/user';
import dotenv from 'dotenv';
dotenv.config();

const loginRouter = Router();

loginRouter.post('/', async (request: Request, response: Response) => {
  const { username, password } = request.body;
  console.log('Password:', password);
  const user = await User.findOne({ username });
  console.log('user:', user);
  if (!user) {
    return response.status(400).json({ error: 'missing user' });
  }
  if (!user.passwordHash) {
    return response.status(400).json({ error: 'missing password' });
  }

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash);
  console.log('Password hash:', user.passwordHash);
  console.log('Password correct:', passwordCorrect);
  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    });
  }
  const userForToken: JwtPayload = {
    username: user.username,
    id: user._id.toString(),
  };

  const token = jwt.sign(
    userForToken,
    process.env.SECRET as string
  );
  console.log(token);

  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

export default loginRouter;
