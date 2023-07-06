import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { RequestCastom } from '../types';
import AuthorizationError from '../errors/authorization-err';

const auth = (req: RequestCastom, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new AuthorizationError('Необходима авторизация');
  }

  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (error) {
    throw new AuthorizationError('Необходима авторизация');
  }

  req.user = payload;
  next();
};

export default auth;
