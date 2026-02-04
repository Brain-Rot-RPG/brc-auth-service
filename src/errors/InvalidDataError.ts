import { BaseError } from './BaseError.js';

export class InvalidDataError extends BaseError {
    constructor(field: string, message: string) {
        super(`Invalid data for field '${field}': ${message}`, 400);
        this.name = 'InvalidUserDataError';
    }
}
