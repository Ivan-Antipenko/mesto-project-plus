/* eslint-disable no-unused-vars */
import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import isURL from 'validator/lib/isURL';

const bcrypt = require('bcryptjs');
const AuthorizationError = require('../errors/AuthorizationError');

interface IUser {
  email: string;
  password: string;
  name: string;
  about: string;
  avatar: string;
}

interface UserModel extends mongoose.Model<IUser> {
  findUserByCredentials: (
    email: string,
    password: string
  ) => Promise<mongoose.Document<unknown, any, IUser>>;
}

const userSchema = new mongoose.Schema<IUser, UserModel>({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v: string) => isEmail(v),
      message: 'Не валидный email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v: string) => isURL(v),
      message: 'Не валидная ссылка',
    },
  },
});

userSchema.static(
  'findUserByCredentials',
  function findUserByCredentials(email: string, password: string) {
    return this.findOne({ email })
      .select('+password')
      .then((user) => {
        if (!user) {
          throw new AuthorizationError('Неправильные почта или пароль');
        }

        return bcrypt
          .compare(password, user.password)
          .then((matched: boolean) => {
            if (!matched) {
              throw new AuthorizationError('Неправильные почта или пароль');
            }
            return user;
          });
      });
  }
);

export default mongoose.model<IUser, UserModel>('user', userSchema);
