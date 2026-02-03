import { User } from '../../../domain/entities/user/User.js';
import type { UserRepository } from '../../../domain/repositories/UserRepository.js';
import type { PostgresDatabase } from './Database.js';

export class PostgresUserRepository implements UserRepository {
    constructor(private readonly db: PostgresDatabase) {}

    async save(user: User): Promise<void> {
        const query = `
      INSERT INTO users (id, username, email, password_hash, is_sigma, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (id) DO UPDATE SET
        username = EXCLUDED.username,
        email = EXCLUDED.email,
        password_hash = EXCLUDED.password_hash,
        is_sigma = EXCLUDED.is_sigma,
        updated_at = EXCLUDED.updated_at
    `;
    
        await this.db.query(query, [
            user.id,
            user.username,
            user.email,
            user.passwordHash,
            user.isSigma,
            user.createdAt,
            user.updatedAt
        ]);
    }

    async findByEmail(email: string): Promise<User | null> {
        const res = await this.db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (res.rows.length === 0) return null;
        return this.mapRowToUser(res.rows[0]);
    }

    async findByUsername(username: string): Promise<User | null> {
        const res = await this.db.query('SELECT * FROM users WHERE username = $1', [username]);
        if (res.rows.length === 0) return null;
        return this.mapRowToUser(res.rows[0]);
    }

    async findById(id: string): Promise<User | null> {
        const res = await this.db.query('SELECT * FROM users WHERE id = $1', [id]);
        if (res.rows.length === 0) return null;
        return this.mapRowToUser(res.rows[0]);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private mapRowToUser(row: any): User {
        return User.builder
            .withId(row.id)
            .username(row.username)
            .email(row.email)
            .passwordHash(row.password_hash)
            .sigma(row.is_sigma)
            .dates(row.created_at, row.updated_at)
            .build();
    }
}
