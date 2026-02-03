import { logger } from './infrastructure/logging/logger.js';
import { Server } from './infrastructure/web/server.js';

async function bootstrap() {
    try {
        const server = new Server();
        await server.start();
    } catch (err) {
        logger.fatal({ err }, 'Uncaught exception during bootstrap');
        process.exit(1);
    }
}

bootstrap();
