import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';

const bcrypt = require('bcryptjs');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ConflictError = require('../errors/ConflictError');

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

export const getUser = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.user)
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

export const getUserbyId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  User.findById(req.params.userId)
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
  const { email, password, name, about, avatar } = req.body;
  bcrypt.hash(password, 3).then((hash: string) => {
    User.create({ email, password: hash, name, about, avatar })
      .then((data) => {
        res.status(200).send({ message: data });
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new ValidationError('Не валидные данные'));
        } else if (err.code === 11000) {
          next(new ConflictError('Пользователь с таким email уже существует'));
        } else {
          next(err);
        }
      });
  });
};

export const changeUserInfo = (
  req: Request,
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
  req: Request,
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
      const id = String(user._id);
      const token = jwt.sign({ _id: id }, 'secret', {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};
