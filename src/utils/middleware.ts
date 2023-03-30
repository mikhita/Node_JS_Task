import logger from './logger';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User, {UserDoc} from '../models/user';
import CategoryRequest from '../types/categoryRequest';

interface IRequest extends Request {
  token?: string;
  user?: any;
}

export const requestLogger = (request: IRequest, response: Response<any>, next: NextFunction): void => {
  logger.info('Method:', request.method);
  logger.info('Path:  ', request.path);
  logger.info('Body:  ', request.body);
  logger.info('---');
  next();
};

export const unknownEndpoint = (request: IRequest, response: Response<any>): void => {
  response.status(404).send({ error: 'unknown endpoint' });
};

export const errorHandler = (error: Error, request: IRequest, response: Response<any>): void => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    response.status(400).json({ error: error.message });
  } else if (error.name ===  'JsonWebTokenError') {
    response.status(400).json({ error: error.message });
  } else if (error.name === 'TokenExpiredError') {
    response.status(401).json({
      error: 'token expired'
    });
  } else {
    response.status(500).json({ error: 'Something went wrong!' });
  }
};


export const getTokenFrom = (request: IRequest): string | null => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '');
  }
  return null;
};

export const tokenExtractor = (request: IRequest, response: Response, next: NextFunction): void => {
  const token = getTokenFrom(request);
  request.token = token as string | undefined;
  next();
};

export const userExtractor = async (request: CategoryRequest, response: Response, next: NextFunction) => {
  try {
    const authorization = request.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      const token = authorization.substring(7);
      if (process.env.SECRET) {
        const decodedToken = jwt.verify(token, process.env.SECRET) as { id: string };
        const user: UserDoc | null = await User.findById(decodedToken.id);
        if (!user) {
          throw new Error('User not found');
        }

        request.user = user;
        request.token = token;
        }
    }
  } catch (error) {
    next(error);
  }

  next();
};




