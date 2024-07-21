import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const EXPIRES_IN = '1d';

export const createAccessToken = (payload: { id: number }) => {
  const tokenSecret = process.env.TOKEN_SECRET || '';

  return new Promise((resolve, reject) => {
    jwt.sign(payload, tokenSecret, { expiresIn: EXPIRES_IN }, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
};
