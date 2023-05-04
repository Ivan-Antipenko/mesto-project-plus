import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import auth from './middlewars/auth';
import { userRouter } from './routes/userRouter';
import cardsRouter from './routes/cardsRouter';
import errorHandler from './middlewars/errorHandler';
import { errorLogger, requestLogger } from './middlewars/logger';
import authRouter from './routes/authRouter';

const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(requestLogger);
app.use(authRouter);
app.use(auth);
app.use('/users', userRouter);
app.use('/cards', cardsRouter);
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Page not found'));
});
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
