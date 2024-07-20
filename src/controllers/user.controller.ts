import { Request, Response } from 'express';
import { User } from '../models/User';

let users: User[] = [
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

    // TODO: Add repeated email user

    users.push(newUser);

    res.send(newUser);
  } catch (error: unknown) {
    res.status(400).send({
      error,
    });
  }
};

export const updateUser = (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const foundUser = users.find((user) => user.id.toString() === userId);

    if (!foundUser) {
      return res.status(400).send({
        error: 'User not found',
      });
    }

    const updatedUser: User = { ...foundUser, ...req.body };

    users = users.map((user) =>
      user.id.toString() === userId ? updatedUser : user
    );

    res.send(updatedUser);
  } catch (error: unknown) {
    res.status(400).send({
      error,
    });
  }
};

export const deleteUser = (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const foundUser = users.find((user) => user.id.toString() === userId);

    if (!foundUser) {
      return res.status(400).send({
        error: 'User not found',
      });
    }

    users = users.filter((user) => user.id.toString() !== userId);

    res.send({
      message: 'User deleted successfully',
    });
  } catch (error: unknown) {
    res.status(400).send({
      error,
    });
  }
};
