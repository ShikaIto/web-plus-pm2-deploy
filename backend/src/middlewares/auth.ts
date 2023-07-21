import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { RequestCastom } from '../types';
import AuthorizationError from '../errors/authorization-err';

const auth = (req: RequestCastom, res: Response, next: NextFunction) => {
  let token = req.cookies.jwt;
  const { authorization } = req.headers;

  if (!token && (!authorization || !authorization.startsWith('Bearer '))) {
    throw new AuthorizationError('Необходима авторизация');
  }

  if (!token && authorization) {
    token = authorization.replace('Bearer ', '');
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
