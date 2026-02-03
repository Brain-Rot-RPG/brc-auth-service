import type { AuthToken } from '../entities/auth/AuthToken.js';

export interface TokenRepository {
    save(token: AuthToken): Promise<void>;
    findByRefreshToken(refreshToken: string): Promise<AuthToken | null>;
    revoke(refreshToken: string): Promise<void>;
    isRevoked(refreshToken: string): Promise<boolean>;
    revokeAllForUser(userId: string): Promise<void>;
}
