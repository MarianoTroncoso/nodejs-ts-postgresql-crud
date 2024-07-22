import { Response, Request } from 'express';

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
};

export type ErrorMessageResponse = { error: string };

export type LoginResponse = Response<User | ErrorMessageResponse>;

type LoginRequestBody = Pick<User, 'email' | 'password'>;

export type LoginRequest = Request<{}, {}, LoginRequestBody>;

type RegisterUserRequestBody = Omit<User, 'id'>;

export type RegisterRequest = Request<{}, {}, RegisterUserRequestBody>;

export type GetUsersResponse = Response<User[] | ErrorMessageResponse>;
