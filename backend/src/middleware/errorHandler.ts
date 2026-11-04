import { Request, Response, NextFunction } from 'express';

type ErrorWithStatus = Error & { statusCode?: number };

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  void _next;
  const error = err instanceof Error ? err : new Error('Something went wrong!');
  const statusCode = (err as ErrorWithStatus).statusCode || 500;

  console.error('❌ Error:', error.stack ?? error.message);

  res.status(statusCode).json({
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};