/* eslint-disable consistent-return */
import { Response, Request, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// import { RequestCustom } from '../types/types';

const AuthorizationError = require('../errors/AuthorizationError');

const auth = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new AuthorizationError('Необходима авторизация'));
  } else {
    const token = authorization.replace('Bearer ', '');
    let payload;
    try {
      payload = jwt.verify(token, 'secret');
      req.user = payload;
    } catch (err) {
      next(AuthorizationError('Необходима авторизация'));
    }
    next();
  }
};

export default auth;
