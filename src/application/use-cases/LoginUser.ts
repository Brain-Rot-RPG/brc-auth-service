import type { AuthToken } from '../../domain/entities/auth/AuthToken.js';
import type { TokenRepository } from '../../domain/repositories/TokenRepository.js';
import type { UserRepository } from '../../domain/repositories/UserRepository.js';
import type { PasswordService } from '../../domain/services/PasswordService.js';
import type { TokenService } from '../../domain/services/TokenService.js';
import { AuthenticationError } from '../../errors/AuthenticationError.js';
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

        return token;
    }
}
