import { Request, Response, NextFunction } from 'express';
import { ErrorCastom } from '../types';

const error = (err: ErrorCastom, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
};

export default error;
