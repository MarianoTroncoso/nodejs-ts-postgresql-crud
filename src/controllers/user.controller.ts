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
  res: Response<User[] | { error: unknown }>
) => {
  try {
    res.send(users);
  } catch (error: unknown) {
    res.status(404).send({
      error,
    });
  }
};

export const createUser = (req: Request, res: Response) => {
  try {
    const newUser: User = { ...req.body, id: users.length + 1 };

    users.push(newUser);

    res.send(newUser);
  } catch (error: unknown) {
    res.status(404).send({
      error,
    });
  }
};
