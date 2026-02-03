import type { UserRepository } from '../../domain/repositories/UserRepository.js';
import { NotFoundError } from '../../errors/NotFoundError.js';
import type { UserResponseDTO } from '../../shared/dtos/UserResponseDTO.js';

export class GetUserProfile {
    constructor(private readonly userRepo: UserRepository) {}

    async execute(userId: string): Promise<UserResponseDTO> {
        const user = await this.userRepo.findById(userId);
        if (!user) {
            throw new NotFoundError('User');
        }

        return {
            id: user.id,
            username: user.username,
            email: user.email,
            isSigma: user.isSigma,
            createdAt: user.createdAt
        };
    }
}
