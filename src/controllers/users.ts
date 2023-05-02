import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { RequestCustom } from '../types';
import User from '../models/user';

const bcrypt = require('bcryptjs');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
// const AuthorizationError = require('../errors/AuthorizationError');

export const getAllUsers = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  User.find({})
    .then((data) => res.send(data))
    .catch((err) => {
      next(err);
    });
};

export const getUser = (
  req: RequestCustom,
  res: Response,
  next: NextFunction
) => {
  const id = req.user;
  User.findById(id)
    .orFail(() => {
      throw new NotFoundError('Пользователь с данным id не найден');
    })
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Не валидный id'));
      } else {
        next(err);
      }
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  bcrypt.hash(password, 10).then((hash: string) => {
    User.create({ email, password: hash })
      .then((data) => {
        res.status(200).send({ message: data });
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new ValidationError('Не валидные данные'));
        } else {
          next(err);
        }
      });
  });
};

export const changeUserInfo = (
  req: RequestCustom,
  res: Response,
  next: NextFunction
) => {
  const newName = req.body.name;
  const newAbout = req.body.about;
  User.findOneAndUpdate(
    { _id: req.user },
    { name: newName, about: newAbout },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      throw new NotFoundError('Пользователь с данным id не найден');
    })
    .then((data) => {
      res.status(200).send({ message: data });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Не валидные данные'));
      } else {
        next(err);
      }
    });
};

export const setNewAvatar = (
  req: RequestCustom,
  res: Response,
  next: NextFunction
) => {
  const newAvatar = req.body.avatar;
  User.findOneAndUpdate(
    { _id: req.user },
    { avatar: newAvatar },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      throw new NotFoundError('Пользователь с данным id не найден');
    })
    .then((data) => {
      res.status(200).send({ message: data });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Не валидные данные'));
      } else {
        next(err);
      }
    });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};
