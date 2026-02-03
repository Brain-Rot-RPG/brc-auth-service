import amqp from 'amqplib';

import { logger } from '../logging/logger.js';

export class RabbitMQConnection {
    private static instance: RabbitMQConnection;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private connection: any | undefined;
    private channel: amqp.Channel | undefined;

     
    private constructor() {}

    static getInstance(): RabbitMQConnection {
        if (!RabbitMQConnection.instance) {
            RabbitMQConnection.instance = new RabbitMQConnection();
        }
        return RabbitMQConnection.instance;
    }

    async connect(uri: string): Promise<void> {
        if (this.connection) return;

        try {
            logger.info('Connecting to RabbitMQ...');
            this.connection = await amqp.connect(uri);
            this.channel = await this.connection.createChannel();

            logger.info('✅ Connected to RabbitMQ');

            this.connection.on('error', (err: unknown) => {
                logger.error({ err }, 'RabbitMQ connection error');
            });

            this.connection.on('close', () => {
                logger.warn('RabbitMQ connection closed');
                this.connection = undefined;
                this.channel = undefined;
            });

        } catch (error) {
            logger.fatal({ error }, 'Could not connect to RabbitMQ');
            // We do not throw to avoid crashing the whole auth service if log service is down
        }
    }

    getChannel(): amqp.Channel | undefined {
        return this.channel;
    }
}
