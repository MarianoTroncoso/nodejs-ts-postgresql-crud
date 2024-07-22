import { Request, Response } from 'express';
import { createAccessToken } from '../libs/jwt';
import {
  TOKEN_COOKIE_NAME,
  NUMBER_OF_SALT_ROUNDS,
  OK_STATUS_CODE,
  INTERNAL_SERVER_ERROR_MESSAGE,
  INTERNAL_SERVER_ERROR_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  BAD_REQUEST_STATUS_CODE,
} from './constants';
import bcrypt from 'bcrypt';
import { QueryResult } from 'pg';
import { pool } from '../database/database';
import {
  GetUsersResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
} from './types';

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
      'SELECT * FROM users;'
    );

    return res.status(OK_STATUS_CODE).json(response.rows);
  } catch (error: unknown) {
    return res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).send({
      error: INTERNAL_SERVER_ERROR_MESSAGE,
    });
  }
};

export const login = async (
  req: LoginRequest,
  res: LoginResponse
): Promise<LoginResponse> => {
  const { email, password } = req.body;

  try {
    const userFound = users.find((user) => user.email === email);

    if (!userFound) {
      return res.status(NOT_FOUND_STATUS_CODE).send({
        error: 'User not found',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, userFound.password);

    if (!isPasswordValid) {
      return res.status(BAD_REQUEST_STATUS_CODE).send({
        error: 'Invalid password',
      });
    }

    const token = await createAccessToken({ email });

    res.cookie(TOKEN_COOKIE_NAME, token);

    return res.status(OK_STATUS_CODE).json(userFound);
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).json({
      error: INTERNAL_SERVER_ERROR_MESSAGE,
    });
  }
};

export const registerUser = async (req: RegisterRequest, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const checkDuplicatedEmailResponse: QueryResult = await pool.query(
      'SELECT * FROM users WHERE email = $1;',
      [email]
    );

    const emailAlreadyExists = checkDuplicatedEmailResponse.rows.length >= 1;

    if (emailAlreadyExists) {
      return res.status(BAD_REQUEST_STATUS_CODE).send({
        error: 'Email already exists',
      });
    }

    const passwordHash = await bcrypt.hash(password, NUMBER_OF_SALT_ROUNDS);

    await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3);',
      [name, email, passwordHash]
    );

    const token = await createAccessToken({ email });

    res.cookie(TOKEN_COOKIE_NAME, token);

    return res.status(OK_STATUS_CODE).json({
      user: {
        name,
        email,
      },
    });
  } catch (error: unknown) {
    res.status(BAD_REQUEST_STATUS_CODE).send({
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
