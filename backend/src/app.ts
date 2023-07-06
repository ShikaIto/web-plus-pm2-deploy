import * as dotenv from 'dotenv';
import express, { json } from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { celebrate, Joi, errors } from 'celebrate';
import validator from 'validator';
import routes from './routes/index';
import { login, createUser } from './controllers/user';
import error from './middlewares/error';
import auth from './middlewares/auth';
import { requestLogger, errorLogger } from './middlewares/logger';

dotenv.config();

const { PORT = 3000 } = process.env;
const { MONGOURL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

app.use(cookieParser());

app.use(json());

mongoose.connect(MONGOURL);

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(200),
      avatar: Joi.string().custom((value: string, helpers: any) => {
        if (validator.isURL(value)) {
          return value;
        }
        return helpers.message('Невалидная ссылка');
      }),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

app.use(auth);

app.use('/', routes);

app.use(errorLogger);
app.use(errors());
app.use(error);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
