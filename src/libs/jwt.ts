import jwt from 'jsonwebtoken';

const EXPIRES_IN = '1d';

export const createAccessToken = (payload: { email: string }) => {
  const tokenSecret = process.env.TOKEN_SECRET || '';

  return new Promise((resolve, reject) => {
    jwt.sign(payload, tokenSecret, { expiresIn: EXPIRES_IN }, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
};
