import mongoose, { ObjectId } from 'mongoose';
import isURL from 'validator/lib/isURL';

export interface ICard {
  name: string;
  link: string;
  owner: ObjectId;
  likes: [ObjectId];
  createdAt: Date;
}

const cardSchema = new mongoose.Schema<ICard>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => isURL(v),
      message: 'Не валидная ссылка',
    },
  },
  owner: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
    default: [],
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
});

export default mongoose.model<ICard>('card', cardSchema);
