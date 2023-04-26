import { Router } from 'express';
import {
  getAllCards,
  addCard,
  deleteCard,
  setLike,
  deleteLike,
} from '../controllers/cards';
import {
  addCardValidation,
  changeCardValidation,
} from '../validation/cardsValidation';

const cardsRouter = Router();
export default cardsRouter;

cardsRouter.get('/', getAllCards);
cardsRouter.post('/', addCardValidation, addCard);
cardsRouter.delete('/:cardId', changeCardValidation, deleteCard);
cardsRouter.put('/:cardId/likes', changeCardValidation, setLike);
cardsRouter.delete('/:cardId/likes', changeCardValidation, deleteLike);
