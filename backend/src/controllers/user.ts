import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RequestCastom } from '../types';
import NotFoundError from '../errors/not-found-err';
import ValidationError from '../errors/validation-err';
import User from '../models/user';

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await User.find();
    return res.status(200).send(users);
  } catch (error) {
    return next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ ...req.body, password: hash });
    return res.status(201).send(newUser);
  } catch (error: any) {
    if (error instanceof mongoose.Error.ValidationError) {
      throw new ValidationError('Ошибка валидации');
    }

    if (error.code === 11000) {
      throw new ValidationError('Такой email уже существует');
    }
    return next(error);
  }
};

export const getUser = async (
  req: RequestCastom,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.user;
    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    return res.status(200).send(user);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw new ValidationError('Ошибка валидации');
    }
    return next(error);
  }
};

export const updateUser = async (
  req: RequestCastom,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.user;
    const { about, name } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      { about, name },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    return res.status(200).send(user);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      throw new ValidationError('Ошибка валидации');
    }
    return next(error);
  }
};

export const updateAvatar = async (
  req: RequestCastom,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.user;
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    return res.status(200).send(user);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      throw new ValidationError('Ошибка валидации');
    }
    return next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ userId: user._id }, 'some-secret-key', {
      expiresIn: '7d',
    });

    return res
      .cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true })
      .status(200)
      .send({ message: 'Авторизация успешна', token });
  } catch (error) {
    return next(error);
  }
};
