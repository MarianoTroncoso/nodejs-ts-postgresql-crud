import { BAD_REQUEST_STATUS_CODE } from '../controllers/constants';
import { ZodSchema, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validateSchema =
  (shema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      shema.parse(req.body);
      next();
    } catch (error) {
      return res
        .status(BAD_REQUEST_STATUS_CODE)
        .json((error as ZodError).errors.map((error) => error.message));
    }
  };
