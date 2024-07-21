import { Router } from 'express';
import {
  getUsers,
  register,
  updateUser,
  deleteUser,
  login,
} from '../controllers/user.controller';

const router = Router();

router.post('/login', login);

router.post('/register', register);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;
