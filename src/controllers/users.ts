import { NextFunction, Request, Response } from 'express';
import { RequestCustom } from '../types';
import User from '../models/user';

const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');

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
  const { id } = req.params;
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
  const newName = req.body.name;
  const newAbout = req.body.about;
  const newAvatar = req.body.avatar;
  User.create({
    name: newName,
    about: newAbout,
    avatar: newAvatar,
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

export const changeUserInfo = (
  req: RequestCustom,
  res: Response,
  next: NextFunction
) => {
  const newName = req.body.name;
  const newAbout = req.body.about;
  User.findOneAndUpdate(
    { _id: req.user?._id },
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
    { _id: req.user?._id },
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
