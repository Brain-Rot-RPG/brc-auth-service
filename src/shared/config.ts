import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

export const config = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: Number.parseInt(process.env.PORT || '4007', 10),
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: Number.parseInt(process.env.DB_PORT || '5432', 10),
        user: process.env.DB_USER || 'admin',
        password: process.env.DB_PASSWORD || 'brainrot_secure',
        name: process.env.DB_NAME || 'auth_db',
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'dev_secret',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret',
        accessExpiration: process.env.JWT_ACCESS_EXPIRATION || '15m',
        refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
    }
};