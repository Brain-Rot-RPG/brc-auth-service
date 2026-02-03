import type { Server as HttpServer } from 'node:http';

import { config } from '../../shared/config.js';
import { logger } from '../logging/logger.js';
import type { ExpressApp } from './app.js';

export class Server {
    private httpServer?: HttpServer;

    constructor(private readonly expressApp: ExpressApp) {}

    public async start(): Promise<void> {
        return new Promise((resolve) => {
            this.httpServer = this.expressApp.app.listen(config.port, () => {
                logger.info(`Server ready on port ${config.port} [${config.nodeEnv}]`);
                logger.info(`Swagger docs: http://localhost:${config.port}/docs`);
                resolve();
            });

            this.setupGracefulShutdown();
        });
    }

    public async stop(): Promise<void> {
        if (this.httpServer) {
            return new Promise((resolve, reject) => {
                this.httpServer?.close((err) => {
                    if (err) return reject(err);
                    resolve();
                });
            });
        }
    }

    private setupGracefulShutdown(): void {
        const signals = ['SIGTERM', 'SIGINT'] as const;

        signals.forEach((signal) => {
            process.on(signal, async () => {
                logger.info(`${signal} received. Starting graceful shutdown...`);
                await this.stop();
                logger.info('HTTP server closed. Exiting.');
                process.exit(0);
            });
        });
    }
}
