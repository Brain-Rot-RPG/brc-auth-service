import type { TokenRepository } from '../../domain/repositories/TokenRepository.js';

export class LogoutUser {
    constructor(private readonly tokenRepo: TokenRepository) {}

    async execute(refreshToken: string): Promise<void> {
        await this.tokenRepo.revoke(refreshToken);
    }
}
