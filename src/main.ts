import { GetUserProfile } from './application/use-cases/GetUserProfile.js';
import { LoginUser } from './application/use-cases/LoginUser.js';
import { LogoutUser } from './application/use-cases/LogoutUser.js';
import { RefreshToken } from './application/use-cases/RefreshToken.js';
import { RegisterUser } from './application/use-cases/RegisterUser.js';
import { UpdateUser } from './application/use-cases/UpdateUser.js';
import { logger  } from './infrastructure/logging/logger.js';
import { RabbitMQConnection } from './infrastructure/messaging/RabbitMQConnection.js';
import { BcryptPasswordService } from './infrastructure/security/BcryptPasswordService.js';
import { JwtTokenService } from './infrastructure/security/JwtTokenService.js';
import { PostgresDatabase } from './infrastructure/storage/postgres/Database.js';
import { PostgresTokenRepository } from './infrastructure/storage/postgres/PostgresTokenRepository.js';
import { PostgresUserRepository } from './infrastructure/storage/postgres/PostgresUserRepository.js';
import { ExpressApp } from './infrastructure/web/app.js';
import { AuthController } from './infrastructure/web/controllers/AuthController.js';
import { AuthMiddleware } from './infrastructure/web/middlewares/AuthMiddleware.js';
import { createAuthRouter } from './infrastructure/web/routes/auth.routes.js';
import { Server } from './infrastructure/web/server.js';
import { config } from './shared/config.js';

async function bootstrap() {
    try {
        // Initialize RabbitMQ
        await RabbitMQConnection.getInstance().connect(config.rabbitmq.url);

        const db = PostgresDatabase.getInstance();
        await db.getPool().query('SELECT 1');
        logger.info('Database connection established');

        const userRepo = new PostgresUserRepository(db);
        const tokenRepo = new PostgresTokenRepository(db);
        const passwordService = new BcryptPasswordService();
        const tokenService = new JwtTokenService();

        const registerUC = new RegisterUser(userRepo, passwordService);
        const loginUC = new LoginUser(userRepo, tokenRepo, passwordService, tokenService);
        const logoutUC = new LogoutUser(tokenRepo);
        const refreshUC = new RefreshToken(tokenRepo, userRepo, tokenService);
        const getUserProfileUC = new GetUserProfile(userRepo);
        const updateUserUC = new UpdateUser(userRepo);

        const authMiddleware = new AuthMiddleware(tokenService);
        const authController = new AuthController(
            registerUC, 
            loginUC,
            logoutUC,
            refreshUC,
            getUserProfileUC,
            updateUserUC
        );
        const authRouter = createAuthRouter(authController, authMiddleware);

        const app = new ExpressApp(authRouter);
        const server = new Server(app);
        
        await server.start();

        const shutdown = async () => {
            logger.info('Shutting down...');
            await db.close();
            process.exit(0);
        };
        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);

    } catch (err) {
        logger.fatal({ err }, 'Uncaught exception during bootstrap');
        process.exit(1);
    }
}

await bootstrap();
