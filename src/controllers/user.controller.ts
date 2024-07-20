import { Request, Response } from 'express';
import { User } from '../models/User';

const users: User[] = [
  {
    id: 0,
    name: 'John Doe',
    email: 'jd@gmail.com',
  },
  {
    id: 1,
    name: 'Jane Doe',
    email: 'jand@gmail.com',
  },
];

export const getUsers = (
  _: Request,
  res: Response<User[] | { error: string }>
) => {
  try {
    res.send(users);
  } catch (error: unknown) {
    res.status(404).send({
      error: 'No users found',
    });
  }
};
