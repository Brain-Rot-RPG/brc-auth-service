import { User } from '../../domain/entities/user/User.js';
import type { UserRepository } from '../../domain/repositories/UserRepository.js';
import { ConflictError } from '../../errors/ConflictError.js';
import { NotFoundError } from '../../errors/NotFoundError.js';
import type { UpdateUserDTO } from '../../shared/dtos/UpdateUserDTO.js';
import type { UserResponseDTO } from '../../shared/dtos/UserResponseDTO.js';

export class UpdateUser {
    constructor(private readonly userRepo: UserRepository) {}

    async execute(userId: string, dto: UpdateUserDTO): Promise<UserResponseDTO> {
        const user = await this.userRepo.findById(userId);
        if (!user) {
            throw new NotFoundError('User');
        }

        if (dto.email && dto.email !== user.email) {
            const existing = await this.userRepo.findByEmail(dto.email);
            if (existing && existing.id !== userId) {
                throw new ConflictError('Email already exists');
            }
        }

        const builder = User.builder
            .withId(user.id)
            .username(user.username)
            .passwordHash(user.passwordHash)
            .dates(user.createdAt, new Date());

        if (dto.email) {
            builder.email(dto.email);
        } else {
            builder.email(user.email);
        }

        if (dto.isSigma === undefined) {
            builder.sigma(user.isSigma);
        } else {
            builder.sigma(dto.isSigma);
        }

        const updatedUser = builder.build();

        await this.userRepo.save(updatedUser);

        return {
            id: updatedUser.id,
            username: updatedUser.username,
            email: updatedUser.email,
            isSigma: updatedUser.isSigma,
            createdAt: updatedUser.createdAt
        };
    }
}
