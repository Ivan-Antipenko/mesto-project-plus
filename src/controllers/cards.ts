/* eslint-disable no-console */
import { NextFunction, Request, Response } from 'express';
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

export const addCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user })
    .then((data) => res.send({ message: data }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Не валидные данные'));
      } else {
        next(err);
      }
    });
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  if (req.params.cardId === req.user) {
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
  } else {
    res.send({ message: 'Вы не можете удалить чужую карточку' });
  }
};

export const setLike = (req: Request, res: Response, next: NextFunction) => {
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

export const deleteLike = (req: Request, res: Response, next: NextFunction) => {
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
