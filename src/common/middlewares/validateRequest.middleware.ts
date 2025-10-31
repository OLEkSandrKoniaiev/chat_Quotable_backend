import { Request, Response, NextFunction } from 'express';
import { Schema, ValidationError, ValidationErrorItem } from 'joi';

type RequestPart = 'body' | 'query' | 'params';

export const validateRequest = (schema: Schema, part: RequestPart = 'body') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req[part], { abortEarly: false });
      next();
    } catch (error: unknown) {
      if (error instanceof ValidationError) {
        const errors = error.details.map((detail: ValidationErrorItem) => detail.message);
        return res.status(400).json({ errors });
      }

      console.error('Unexpected error during validation:', error);
      return res.status(500).json({ error: 'An unexpected error occurred during validation.' });
    }
  };
};
