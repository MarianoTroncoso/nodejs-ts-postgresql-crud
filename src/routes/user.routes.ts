import { Router } from 'express';
import { getUsers, registerUser, login } from '../controllers/user.controller';
import { validateSchema } from '../middlewares/validator.middleware';
import { registerUserSchema } from '../schemas/users.schema';

const router = Router();

router.post('/login', login);

router.post('/register', validateSchema(registerUserSchema), registerUser);
router.get('/users', getUsers);

export default router;
