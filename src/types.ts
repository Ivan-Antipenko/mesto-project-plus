import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface RequestCustom extends Request {
  headers: {
    authorization: string;
  };
  user: {
    _id: JwtPayload | string;
  };
}
