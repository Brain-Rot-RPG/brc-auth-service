import { BaseError } from './BaseError.js';

export class ConflictError extends BaseError {
    constructor(message: string) {
        super(message, 409);
        this.name = 'ConflictError';
    }
}
