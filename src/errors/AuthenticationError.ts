import { BaseError } from './BaseError.js';

export class AuthenticationError extends BaseError {
    constructor(message: string = 'Authentication failed') {
        super(message, 401);
        this.name = 'AuthenticationError';
    }
}
