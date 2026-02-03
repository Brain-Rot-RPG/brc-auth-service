import { Validator } from '../../../domain/utils/Validator.js';
import { InvalidUserDataError } from '../../../errors/InvalidUserDataError.js';

export class AuthRequestValidators {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static register(body: any): void {
        // Required fields
        if (!body) throw new InvalidUserDataError('body', 'Missing request body');
        
        const username = Validator.string(body.username, 'username');
        Validator.email(body.email, 'email');
        const password = Validator.string(body.password, 'password');
        
        // Specific rules
        if (username.length < 3 || username.length > 20) {
            throw new InvalidUserDataError('username', 'Must be between 3 and 20 characters');
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            throw new InvalidUserDataError('username', 'Must contain only letters, numbers and underscores');
        }
        if (password.length < 12) {
            throw new InvalidUserDataError('password', 'Must be at least 12 characters');
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static login(body: any): void {
        if (!body) throw new InvalidUserDataError('body', 'Missing request body');
        
        Validator.string(body.username, 'username');
        Validator.string(body.password, 'password');
    }
     
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static refreshToken(body: any): void {
        if (!body) throw new InvalidUserDataError('body', 'Missing request body');
        Validator.string(body.refreshToken, 'refreshToken');
    }
     
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static updateProfile(body: any): void {
        if (!body) throw new InvalidUserDataError('body', 'Missing request body');

        if (body.email !== undefined) {
            Validator.email(body.email, 'email');
        }
        if (body.isSigma !== undefined) {
            Validator.boolean(body.isSigma, 'isSigma');
        }
        
        // Whitelist check
        const allowed = ['email', 'isSigma'];
        Object.keys(body).forEach(key => {
            if (!allowed.includes(key)) {
                throw new InvalidUserDataError(key, 'Field not allowed');
            }
        });
        
        if (Object.keys(body).length === 0) {
            throw new InvalidUserDataError('body', 'At least one field must be provided');
        }
    }
}
