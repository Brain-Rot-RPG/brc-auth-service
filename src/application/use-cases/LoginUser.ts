import type { AuthToken } from '../../domain/entities/auth/AuthToken.js';
import type { TokenRepository } from '../../domain/repositories/TokenRepository.js';
import type { UserRepository } from '../../domain/repositories/UserRepository.js';
import type { PasswordService } from '../../domain/services/PasswordService.js';
import type { TokenService } from '../../domain/services/TokenService.js';
import { AuthenticationError } from '../../errors/AuthenticationError.js';
import {logger} from '../../infrastructure/logging/logger.js';
import { logPublisher } from '../../infrastructure/messaging/LogPublisher.js';
import type { LoginDTO } from '../../shared/dtos/LoginDTO.js';

export class LoginUser {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly tokenRepo: TokenRepository,
        private readonly passwordService: PasswordService,
        private readonly tokenService: TokenService
    ) {}

    async execute(dto: LoginDTO): Promise<AuthToken> {
        const user = await this.userRepo.findByUsername(dto.username);
        if (!user) {
            throw new AuthenticationError('Invalid credentials');
        }

        const valid = await this.passwordService.compare(dto.password, user.passwordHash);
        if (!valid) {
            throw new AuthenticationError('Invalid credentials');
        }

        const token = this.tokenService.generate(user);
    
        // We only save the refresh token hash theoretically, but here we mock saving the full concept
        await this.tokenRepo.save(token);

        try {
            await logPublisher.publish({
                service: 'brc-auth-service',
                level: 'INFO',
                message: 'User logged in successfully',
                timestamp: new Date(),
                payload: { userId: user.id, username: user.username },
                traceId: crypto.randomUUID()
            });
        } catch (error) {
            // Non-blocking log error
            logger.error('Failed to log login event', error);
        }

        return token;
    }
}
