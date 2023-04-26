import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import { RequestCustom } from './types';
import { userRouter } from './routes/userRouter';
import cardsRouter from './routes/cardsRouter';
import errorHandler from './middlewars/errorHandler';

const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  const reqCustom = req as RequestCustom;
  reqCustom.user = {
    _id: '644867602c4b36eec06b541d',
  };

  next();
});
app.use('/users', userRouter);
app.use('/cards', cardsRouter);
app.use(errors());
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Page not found'));
});
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
