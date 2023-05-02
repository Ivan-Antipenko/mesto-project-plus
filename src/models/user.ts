/* eslint-disable no-unused-vars */
import mongoose from 'mongoose';

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
  },
});

userSchema.static(
  'findUserByCredentials',
  function findUserByCredentials(email: string, password: string) {
    return this.findOne({ email }).then((user: any) => {
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
