import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';

const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;

  const message =
    statusCode === 500 ? 'На сервере произошла ошибка' : err.message;
  res.status(err.statusCode).send({ message });
  next();
};

export default errorHandler;
