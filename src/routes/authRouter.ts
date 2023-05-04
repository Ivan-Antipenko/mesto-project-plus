import { Router } from 'express';
import { createNewUserValidation, loginValidation } from '../validation/auth';
import { createUser, login } from '../controllers/users';

const authRouter = Router();
export default authRouter;

authRouter.post('/signin', loginValidation, login);
authRouter.post('/signup', createNewUserValidation, createUser);
