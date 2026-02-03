import fs from 'node:fs';
import { resolve } from 'node:path';

import type { Application } from 'express';
import express from 'express';
import { pinoHttp } from 'pino-http';
import swaggerUi from 'swagger-ui-express';
import { parse } from 'yaml';

import { logger } from '../logging/logger.js';
import { errorHandler } from './middlewares/ErrorHandler.js';

export class ExpressApp {
    public app: Application;

    constructor(
        private readonly authRouter: express.Router
    ) {
        this.app = express();
        this.setupMiddlewares();
        this.setupRoutes();
        this.setupDocs();
        this.setupErrorHandling();
    }

    private setupMiddlewares(): void {
        this.app.use(pinoHttp({ logger }));
        this.app.use(express.json());
    }

    private setupRoutes(): void {
        this.app.get('/health', (req, res) => { res.json({ status: 'ok', timestamp: new Date() }); });
        
        // API v1 prefix
        this.app.use('/api/v1/auth', this.authRouter);
    }

    private setupDocs(): void {
        try {
            // Robust path resolution relative to CWD, assuming standard launch
            const docPath = resolve(process.cwd(), 'docs/auth.yaml');
      
            if (fs.existsSync(docPath)) {
                const file = fs.readFileSync(docPath, 'utf8');
                this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(parse(file)));
                logger.info('Swagger docs initialized at /docs');
            } else {
                logger.warn(`Swagger docs not found at ${docPath}`);
            }
        } catch (error) {
            logger.error({ error }, 'Failed to load Swagger documentation');
        }
    }

    private setupErrorHandling(): void {
        this.app.use(errorHandler);
    }
}
