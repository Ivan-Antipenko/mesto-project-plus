/* eslint-disable no-unused-vars */
import { JwtPayload } from 'jsonwebtoken';

export {};

declare global {
  namespace Express {
    interface Request {
      user: {
        _id: JwtPayload | string;
      };
    }
  }
}