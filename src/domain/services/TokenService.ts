import type { AuthToken } from '../entities/auth/AuthToken.js';
import type { User } from '../entities/user/User.js';

export interface JwtPayload {
    userId: string;
    username: string;
    isSigma: boolean;
    iat?: number;
    exp?: number;
}

export interface TokenService {
    generate(user: User): AuthToken;
    verify(token: string): JwtPayload;
    decode(token: string): JwtPayload | null;
}
