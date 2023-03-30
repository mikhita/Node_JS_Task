import morgan from 'morgan';
import config from './utils/config';
import express, { Application } from 'express';
import cors from 'cors';
import categoriesRouter from './controlers/categories';
import { transactionsRouter } from './controlers/transactions';
import usersRouter from './controlers/users';
import loginRouter from './controlers/login';
import resetPasswordRouter from './controlers/reset_password';
import { requestLogger } from './utils/middleware';
import { tokenExtractor } from './utils/middleware';
import { unknownEndpoint } from './utils/middleware';
import { errorHandler } from './utils/middleware';
import { userExtractor } from './utils/middleware';
import logger from './utils/logger';
import mongoose from 'mongoose';

mongoose.set('strictQuery', false);

logger.info('connecting to', config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error: Error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });

const app: Application = express();

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(requestLogger);
app.use(tokenExtractor);

app.use('/api/categories', categoriesRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/reset-password', resetPasswordRouter);

app.use(unknownEndpoint);
app.use(errorHandler);
app.use('/api/categories', userExtractor, categoriesRouter);
app.use('/api/transactions', userExtractor, transactionsRouter);
app.use(morgan('tiny'));

export default app;