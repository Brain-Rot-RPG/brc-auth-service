import type {NextFunction,Request, Response } from 'express';

import { BaseError } from '../../../errors/BaseError.js';
import { logger } from '../../logging/logger.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction): void => {
    if (err instanceof BaseError) {
        logger.warn({ err }, `Handled error: ${err.message}`);
        
        res.status(err.statusCode).json({
            status: 'error',
            code: err.name,
            message: err.message,
            timestamp: new Date().toISOString()
        });
        return;
    }

    // Handle JWT Library Errors specifically
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        res.status(401).json({
            status: 'error',
            code: 'AuthenticationError',
            message: 'Invalid or expired token',
            timestamp: new Date().toISOString()
        });
        return;
    }

    logger.error({ err }, 'Unhandled error occurred');

    res.status(500).json({
        status: 'error',
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred.',
        timestamp: new Date().toISOString()
    });
};
