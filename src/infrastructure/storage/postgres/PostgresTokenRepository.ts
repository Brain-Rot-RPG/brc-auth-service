import { AuthToken } from '../../../domain/entities/auth/AuthToken.js';
import type { TokenRepository } from '../../../domain/repositories/TokenRepository.js';
import type { PostgresDatabase } from './Database.js';

export class PostgresTokenRepository implements TokenRepository {
    constructor(private readonly db: PostgresDatabase) {}

    async save(token: AuthToken): Promise<void> {
        const query = `
      INSERT INTO refresh_tokens (token_hash, user_id, expires_at)
      VALUES ($1, $2, $3)
    `;
        await this.db.query(query, [token.refreshToken, token.userId, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]); 
    }

    async findByRefreshToken(refreshToken: string): Promise<AuthToken | null> {
        const res = await this.db.query('SELECT * FROM refresh_tokens WHERE token_hash = $1', [refreshToken]);
        if (res.rows.length === 0) return null;
      
        // Reconstruction partielle pour satisfaire le domaine
        return AuthToken.builder
            .accessToken('placeholder') // Non stocké
            .refreshToken(res.rows[0].token_hash)
            .expiresIn(0)
            .userId(res.rows[0].user_id)
            .build();
    }

    async revoke(refreshToken: string): Promise<void> {
        await this.db.query('DELETE FROM refresh_tokens WHERE token_hash = $1', [refreshToken]);
    }

    async isRevoked(refreshToken: string): Promise<boolean> {
        const res = await this.db.query('SELECT 1 FROM refresh_tokens WHERE token_hash = $1', [refreshToken]);
        return res.rows.length === 0;
    }

    async revokeAllForUser(userId: string): Promise<void> {
        await this.db.query('DELETE FROM refresh_tokens WHERE user_id = $1', [userId]);
    }
}
