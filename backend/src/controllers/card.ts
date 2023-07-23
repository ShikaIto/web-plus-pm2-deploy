import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { RequestCastom } from '../types';
import Card from '../models/card';
import NotFoundError from '../errors/not-found-err';
import ValidationError from '../errors/validation-err';

export const getCards = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const cards = await Card.find();
    return res.status(200).send(cards);
  } catch (error) {
    return next(error);
  }
};

export const createCard = async (
  req: RequestCastom,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, link } = req.body;
    const newCard = await Card.create({ name, link, owner: req.user });
    return res.status(201).send(newCard);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      throw new ValidationError('Ошибка валидации');
    }

    return next(error);
  }
};

export const deleteCard = async (
  req: RequestCastom,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { cardId } = req.params;
    const userId = req.user;
    const card = await Card.findById(cardId);

    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }

    if (card.owner.toString() !== userId) {
      throw new ValidationError('Нелья удалять чужие карточки');
    }

    await card.remove();
    return res.status(200).send({ message: 'Пост удален' });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw new ValidationError('Ошибка валидации');
    }
    return next(error);
  }
};

export const likeCard = async (
  req: RequestCastom,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { cardId } = req.params;
    const userId = req.user;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    );
    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }
    return res.status(200).send(card);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      throw new ValidationError('Ошибка валидации');
    }
    if (error instanceof mongoose.Error.CastError) {
      throw new ValidationError('Ошибка валидации');
    }
    return next(error);
  }
};

export const dislikeCard = async (
  req: RequestCastom,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { cardId } = req.params;
    const userId = req.user;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true },
    );
    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }
    return res.status(200).send(card);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      throw new ValidationError('Ошибка валидации');
    }
    if (error instanceof mongoose.Error.CastError) {
      throw new ValidationError('Ошибка валидации');
    }
    return next(error);
  }
};
