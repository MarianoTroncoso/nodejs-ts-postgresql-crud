import { Response } from 'express';
import { User } from '../models/User';

export type ErrorMessageResponse = { error: string };

export type GetUsersResponse = Response<User[] | ErrorMessageResponse>;
