import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants/index.js';

/**
 * Middleware factory for validating request body against Zod schema
 * @param schema - Zod schema to validate against
 */
export function validate(schema: ZodSchema): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: ERROR_MESSAGES.VALIDATION.FAILED,
          details: errors,
        });
        return;
      }
      next(error);
    }
  };
}

/**
 * Middleware factory for validating request params against Zod schema
 * @param schema - Zod schema to validate against
 */
export function validateParams(schema: ZodSchema): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: ERROR_MESSAGES.VALIDATION.INVALID_PARAMS,
        });
        return;
      }
      next(error);
    }
  };
}

