/* eslint-disable consistent-return */
import { Response, Request, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// import { RequestCustom } from '../types/types';

const AuthorizationError = require('../errors/AuthorizationError');

const auth = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthorizationError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'secret');
  } catch (err) {
    throw new AuthorizationError('Необходима авторизация');
  }
  req.user = payload;

  next();
};

export default auth;
