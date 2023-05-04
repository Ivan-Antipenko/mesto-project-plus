import { Router } from 'express';
import {
  getAllUsers,
  getUser,
  changeUserInfo,
  setNewAvatar,
  getUserbyId,
} from '../controllers/users';
import {
  changeUserInfoValidation,
  setAvatarUserValidation,
} from '../validation/userValidation';

export const userRouter = Router();
export default userRouter;

userRouter.get('/', getAllUsers);
userRouter.get('/me', getUser);
userRouter.get('/:id', getUserbyId);
userRouter.patch('/me', changeUserInfoValidation, changeUserInfo);
userRouter.patch('/me/avatar', setAvatarUserValidation, setNewAvatar);
