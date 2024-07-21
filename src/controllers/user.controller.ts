import { Request, Response } from 'express';
import { User } from '../models/User';
import { createAccessToken } from '../libs/jwt';
import {
  TOKEN_COOKIE_NAME,
  NUMBER_OF_SALT_ROUNDS,
  OK_STATUS_CODE,
  INTERNAL_SERVER_ERROR_MESSAGE,
  INTERNAL_SERVER_ERROR_STATUS_CODE,
} from './constants';
import bcrypt from 'bcrypt';
import { QueryResult } from 'pg';
import { pool } from '../database/database';
import { GetUsersResponse } from './types';

let users: User[] = [
  {
    id: 0,
    name: 'John Doe',
    email: 'jd@gmail.com',
    password: '123',
  },
  {
    id: 1,
    name: 'Jane Doe',
    email: 'jand@gmail.com',
    password: '456',
  },
];

export const getUsers = async (
  _: Request,
  res: GetUsersResponse
): Promise<GetUsersResponse> => {
  try {
    const response: QueryResult<User> = await pool.query(
      'SELECT * FROM products;'
    );

    return res.status(OK_STATUS_CODE).json(response.rows);
  } catch (error: unknown) {
    return res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).send({
      error: INTERNAL_SERVER_ERROR_MESSAGE,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const userFound = users.find((user) => user.email === email);

    if (!userFound) {
      return res.status(400).send({
        error: 'User not found',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, userFound.password);

    if (!isPasswordValid) {
      return res.status(400).send({
        error: 'Invalid password',
      });
    }

    const token = await createAccessToken({ id: userFound.id });

    res.cookie(TOKEN_COOKIE_NAME, token);

    res.json(userFound);
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const emailAlreadyExists = users.some((user) => user.email === email);

    if (emailAlreadyExists) {
      return res.status(400).send({
        error: 'Email already exists',
      });
    }

    const passwordHash = await bcrypt.hash(password, NUMBER_OF_SALT_ROUNDS);

    const newUser: User = {
      ...req.body,
      password: passwordHash,
      id: users.length + 1,
    };

    users.push(newUser);

    const token = await createAccessToken({ id: newUser.id });

    res.cookie(TOKEN_COOKIE_NAME, token);

    res.json(newUser);
  } catch (error: unknown) {
    res.status(400).send({
      error,
    });
  }
};

export const updateUser = (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const userFound = users.find((user) => user.id.toString() === userId);

    if (!userFound) {
      return res.status(400).send({
        error: 'User not found',
      });
    }

    const updatedUser: User = { ...userFound, ...req.body };

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

    const userFound = users.find((user) => user.id.toString() === userId);

    if (!userFound) {
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
