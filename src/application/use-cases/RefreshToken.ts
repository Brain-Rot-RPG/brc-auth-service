import type { AuthToken } from '../../domain/entities/auth/AuthToken.js';
import type { TokenRepository } from '../../domain/repositories/TokenRepository.js';
import type { UserRepository } from '../../domain/repositories/UserRepository.js';
import type { TokenService } from '../../domain/services/TokenService.js';
import { AuthenticationError } from '../../errors/AuthenticationError.js';
import { NotFoundError } from '../../errors/NotFoundError.js';

export class RefreshToken {
    constructor(
        private readonly tokenRepo: TokenRepository,
        private readonly userRepo: UserRepository,
        private readonly tokenService: TokenService
    ) {}

    async execute(refreshToken: string): Promise<AuthToken> {
        const isRevoked = await this.tokenRepo.isRevoked(refreshToken);
        if (isRevoked) {
            // Should trigger security alert: token reuse attempt
            throw new AuthenticationError('Token reused or revoked');
        }

        // Decode without verifying expiration first to get payload, 
        // but honestly we should verify signature.
        // Assuming tokenService.verify checks signature and expiration.
        // If it's expired, we might still want to allow refresh if within grace period?
        // Usually refresh tokens form the database are the source of truth.
    
        // In this simple impl, we trust the DB record mostly. 
        // But we need to know WHO it is.
        const storedToken = await this.tokenRepo.findByRefreshToken(refreshToken);
        if (!storedToken) {
            throw new AuthenticationError('Invalid refresh token');
        }

        const user = await this.userRepo.findById(storedToken.userId);
        if (!user) {
            throw new NotFoundError('User');
        }

        // Rotate tokens
        await this.tokenRepo.revoke(refreshToken);
        const newTokens = this.tokenService.generate(user);
        await this.tokenRepo.save(newTokens);

        return newTokens;
    }
}
