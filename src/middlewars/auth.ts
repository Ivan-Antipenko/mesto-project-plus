/* eslint-disable consistent-return */
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { RequestCustom } from '../types';

const AuthorizationError = require('../errors/AuthorizationError');

const auth = (req: RequestCustom, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthorizationError('Необходима авторизация');
  }
  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new AuthorizationError('Необходима авторизация');
  }
  if (req.user) {
    req.user._id = payload;
  }

  next();
};

export default auth;
