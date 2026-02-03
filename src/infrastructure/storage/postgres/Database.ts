import pg from 'pg';

import { config } from '../../../shared/config.js';
import { logger } from '../../logging/logger.js';

export class PostgresDatabase {
    private static instance: PostgresDatabase;
    private readonly pool: pg.Pool;

    private constructor() {
        this.pool = new pg.Pool({
            host: config.db.host,
            port: config.db.port,
            user: config.db.user,
            password: config.db.password,
            database: config.db.name,
        });
    
        this.pool.on('error', (err) => {
            logger.error({ err }, 'Unexpected error on idle client');
            process.exit(-1);
        });
    }

    public static getInstance(): PostgresDatabase {
        if (!PostgresDatabase.instance) {
            PostgresDatabase.instance = new PostgresDatabase();
        }
        return PostgresDatabase.instance;
    }

    public getPool(): pg.Pool {
        return this.pool;
    }
  
    public async query(text: string, params?: (string | number | boolean | Date | null | undefined)[]) {
        return this.pool.query(text, params);
    }

    public async close(): Promise<void> {
        await this.pool.end();
    }
}
