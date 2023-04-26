import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { RequestCustom } from '../types';
import Card from '../models/card';

const NotFoundError = require('../errors/NotFoundError');
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

export const addCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  Card.create({ name, link })
    .then(() => res.send({ message: 'Карточка успешно добавлена' }))
    .catch(() => next(BaseError));
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then(() => res.send({ message: 'Карточка удалена' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Карточка с данным id не найдена'));
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
    .then(() => res.send({ message: 'Лайк поставлен' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Карточка с данным id не найдена'));
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
    .then(() => res.send({ message: 'Лайк убран' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Карточка с данным id не найдена'));
      } else {
        next(BaseError);
      }
    });
};
