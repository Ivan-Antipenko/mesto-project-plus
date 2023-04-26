import { NextFunction, Request, Response } from 'express';
import { RequestCustom } from '../types';
import User from '../models/user';

const NotFoundError = require('../errors/NotFoundError');
const BaseError = require('../errors/BaseError');

export const getAllUsers = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  User.find({})
    .then((data) => res.send(data))
    .catch(() => {
      next(new BaseError());
    });
};

export const getUser = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  User.findById(id)
    .then((data) => res.status(200).send(data))
    .catch(() => {
      next(new NotFoundError('Пользователь с данным id не найден'));
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
    .then(() => {
      res.status(200).send({ message: 'Пользователь создан' });
    })
    .catch(() => {
      next(new BaseError());
    });
};

export const changeUserInfo = (
  req: RequestCustom,
  res: Response,
  next: NextFunction
) => {
  const newName = req.body.name;
  const newAbout = req.body.about;
  User.findOneAndUpdate(req.user, { name: newName, about: newAbout })
    .then(() => {
      res.status(200).send({ message: 'Информация обновлена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь с данным id не найден'));
      } else {
        next(BaseError);
      }
    });
};

export const setNewAvatar = (
  req: RequestCustom,
  res: Response,
  next: NextFunction
) => {
  const newAvatar = req.body.avatar;
  User.findOneAndUpdate(req.user, { avatar: newAvatar })
    .then(() => {
      res.status(200).send({ message: 'Фотография обновлена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь с данным id не найден'));
      } else {
        next(BaseError);
      }
    });
};
