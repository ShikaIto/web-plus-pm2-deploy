import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import validator from 'validator';
import {
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
} from '../controllers/user';

const userRoutes = Router();

userRoutes.get('/', getUsers);

userRoutes.get('/me', getUser);

userRoutes.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(200),
    }),
  }),
  updateUser,
);

userRoutes.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string()
        .required()
        .custom((value: string, helpers: any) => {
          if (validator.isURL(value)) {
            return value;
          }
          return helpers.message('Невалидная ссылка');
        }),
    }),
  }),
  updateAvatar,
);

export default userRoutes;
