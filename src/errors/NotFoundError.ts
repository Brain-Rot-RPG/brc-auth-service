import { BaseError } from './BaseError.js';

export class NotFoundError extends BaseError {
    constructor(resource: string) {
        super(`${resource} not found`, 404);
        this.name = 'NotFoundError';
    }
}