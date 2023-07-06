import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import validator from 'validator';
import {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} from '../controllers/card';

const cardRoutes = Router();

cardRoutes.get('/', getCards);

cardRoutes.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom((value: string, helpers: any) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Невалидная ссылка');
    }),
  }),
}), createCard);

cardRoutes.delete('/:cardId', deleteCard);

cardRoutes.put('/:cardId/likes', likeCard);

cardRoutes.delete('/:cardId/likes', dislikeCard);

export default cardRoutes;
