/* eslint-disable no-console */
import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { RequestCustom } from '../types';
import Card from '../models/card';

const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const BaseError = require('../errors/BaseError');

export const getAllCards = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Card.find({})
    .then((data) => res.send(data))
    .catch(() => next(new BaseError()));
};

export const addCard = (
  req: RequestCustom,
  res: Response,
  next: NextFunction
) => {
  const id = new Types.ObjectId(req.user?._id);
  const { name, link } = req.body;
  Card.create({ name, link, owner: id })
    .then(() => res.send({ message: 'Карточка успешно добавлена' }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Не валидные данные'));
      } else {
        next(new BaseError());
      }
    });
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('Карточка с данным id не найдена');
    })
    .then(() => res.send({ message: 'Карточка удалена' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Не валидный id'));
      } else {
        next(BaseError);
      }
    });
};

export const setLike = (
  req: RequestCustom,
  res: Response,
  next: NextFunction
) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user } },
    { new: true }
  )
    .orFail(() => {
      throw new NotFoundError('Карточка с данным id не найдена');
    })
    .then(() => res.send({ message: 'Лайк поставлен' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Не валидный id'));
      } else {
        next(BaseError);
      }
    });
};

export const deleteLike = (
  req: RequestCustom,
  res: Response,
  next: NextFunction
) => {
  const id = new Types.ObjectId(req.user?._id);
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: id } },
    { new: true }
  )
    .orFail(() => {
      throw new NotFoundError('Карточка с данным id не найдена');
    })
    .then(() => res.send({ message: 'Лайк убран' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Не валидный id'));
      } else {
        next(BaseError);
      }
    });
};
