import { logger } from '../logging/logger.js';
import { RabbitMQConnection } from './RabbitMQConnection.js';

export interface LogMessage {
    service: string;
    level: string;
    message: string;
    timestamp: Date;
    payload?: Record<string, unknown>;
    traceId?: string;
}

export class LogPublisher {
    private readonly queueName = 'brc_logs_queue';

    constructor(private readonly connection: RabbitMQConnection) {}

    async publish(log: LogMessage): Promise<void> {
        const channel = this.connection.getChannel();
        if (!channel) return;

        try {
            await channel.assertQueue(this.queueName, { durable: true });
            
            const content = Buffer.from(JSON.stringify(log));
            channel.sendToQueue(this.queueName, content, { persistent: true });
        } catch (error) {
            logger.error(`Failed to publish log to RabbitMQ: ${error}`);
        }
    }
}

export const logPublisher = new LogPublisher(RabbitMQConnection.getInstance());
