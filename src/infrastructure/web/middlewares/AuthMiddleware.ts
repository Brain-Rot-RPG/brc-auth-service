import type { NextFunction,Request, Response } from 'express';

import type {TokenService } from '../../../domain/services/TokenService.js';
import { AuthenticationError } from '../../../errors/AuthenticationError.js';

// Extend Express Request to include user
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            user?: any; // Should be typed better
        }
    }
}

export class AuthMiddleware {
    constructor(private readonly tokenService: TokenService) {}

    verify = (req: Request, res: Response, next: NextFunction): void => {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            next(new AuthenticationError('Missing or invalid token'));
            return; 
        }

        const token = authHeader.split(' ')[1];
        try {
            const decoded = this.tokenService.verify(token);
            req.user = decoded;
            next();
        } catch {
            next(new AuthenticationError('Invalid or expired token'));
        }
    };
}
