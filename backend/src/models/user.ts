import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { IUser, IUserModel } from '../types';
import ValidationError from '../errors/validation-err';

export const userSchema = new mongoose.Schema<IUser, IUserModel>({
  name: {
    type: String,
    minLength: 2,
    maxLength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minLength: 2,
    maxLength: 200,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator: (v: any) => validator.isURL(v),
      message: 'Невалидная ссылка',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v: any) => validator.isEmail(v),
      message: 'Невалидный email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.static('findUserByCredentials', async function findUserByCredentials(email: string, password: string) {
  const user: IUser | null = await this.findOne({ email }).select('+password');
  if (!user) {
    throw new ValidationError('Неправильные почта или пароль');
  }

  const matched = await bcrypt.compare(password, user.password);
  if (!matched) {
    throw new ValidationError('Неправильные почта или пароль');
  }

  return user;
});

export default mongoose.model<IUser, IUserModel>('user', userSchema);
