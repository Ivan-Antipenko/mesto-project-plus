import mongoose, { ObjectId, Types } from 'mongoose';

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
  },
  owner: {
    type: Types.ObjectId,
  },
  likes: {
    type: [Types.ObjectId],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

export default mongoose.model<ICard>('card', cardSchema);
