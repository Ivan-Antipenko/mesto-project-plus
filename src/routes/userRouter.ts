import { Router } from 'express';
import {
  getAllUsers,
  getUser,
  createUser,
  changeUserInfo,
  setNewAvatar,
} from '../controllers/users';
import {
  // createUserValidation,
  changeUserInfoValidation,
  setAvatarUserValidation,
} from '../validation/userValidation';

export const userRouter = Router();
export default userRouter;

userRouter.get('/', getAllUsers);
userRouter.get('/:id', getUser);
userRouter.post('/', createUser);
userRouter.patch('/me', changeUserInfoValidation, changeUserInfo);
userRouter.patch('/me/avatar', setAvatarUserValidation, setNewAvatar);
