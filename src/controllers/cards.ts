/* eslint-disable no-console */
import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import Card from '../models/card';

const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const AccessError = require('../errors/AccessError');

export const getAllCards = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Card.find({})
    .populate(['likes', 'owner'])
    .then((data) => res.send(data))
    .catch((err) => next(err));
};

export const addCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user })
    .then(() => res.send({ message: 'Карточка добавлена' }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Не валидные данные'));
      } else {
        next(err);
      }
    });
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('Карточка с данным id не найдена');
    })
    .then((card) => {
      const user = req.user as JwtPayload;
      if (String(card.owner) === user._id) {
        card.deleteOne().then(() => {
          res.send({ message: 'Карточка удалена' });
        });
      } else {
        throw new AccessError('Вы не можете удалять чужие карточки');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Не валидный id'));
      } else {
        next(err);
      }
    });
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
