import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { Model, HydratedDocument } from 'mongoose';

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

export interface IUserModel extends Model<IUser, {}, {}> {
  findUserByCredentials(
    email: string,
    password: string
  ): Promise<HydratedDocument<IUser, {}>>;
}

export interface ICard {
  name: string;
  link: string;
  owner: IUser;
  likes: IUser[];
  createdAt: Date;
}

export interface RequestCastom extends Request {
  user?: string | JwtPayload;
}

export interface ErrorCastom extends Error {
  statusCode?: number;
}
