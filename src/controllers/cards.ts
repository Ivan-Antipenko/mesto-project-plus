/* eslint-disable no-console */
import { NextFunction, Request, Response } from 'express';
import { RequestCustom } from '../types';
import Card from '../models/card';

const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');

export const getAllCards = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Card.find({})
    .then((data) => res.send(data))
    .catch((err) => next(err));
};

export const addCard = (
  req: RequestCustom,
  res: Response,
  next: NextFunction
) => {
  const id = req.user;
  console.log(id);
  const { name, link } = req.body;
  Card.create({ name, link, owner: id })
    .then((data) => res.send({ message: data }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Не валидные данные'));
      } else {
        next(err);
      }
    });
};

export const deleteCard = (
  req: RequestCustom,
  res: Response,
  next: NextFunction
) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('Карточка с данным id не найдена');
    })
    .then(() => res.send({ message: 'Карточка удалена' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Не валидный id'));
      } else {
        next(err);
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
        next(err);
      }
    });
};

export const deleteLike = (
  req: RequestCustom,
  res: Response,
  next: NextFunction
) => {
  const id = req.user;
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
        next(err);
      }
    });
};
