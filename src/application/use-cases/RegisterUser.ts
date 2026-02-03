import { User } from '../../domain/entities/user/User.js';
import type { UserRepository } from '../../domain/repositories/UserRepository.js';
import type { PasswordService } from '../../domain/services/PasswordService.js';
import { ConflictError } from '../../errors/ConflictError.js';
import type { RegisterDTO } from '../../shared/dtos/RegisterDTO.js';

export class RegisterUser {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly passwordService: PasswordService
    ) {}

    async execute(dto: RegisterDTO): Promise<void> {
        const existing = await this.userRepo.findByEmail(dto.email);
        if (existing) {
            throw new ConflictError('Email already exists');
        }

        const existingUser = await this.userRepo.findByUsername(dto.username);
        if (existingUser) {
            throw new ConflictError('Username already exists');
        }

        const hashedPassword = await this.passwordService.hash(dto.password);

        const newUser = User.builder
            .withNewId()
            .username(dto.username)
            .email(dto.email)
            .passwordHash(hashedPassword)
            .sigma(false) // Default not sigma
            .dates(new Date(), new Date())
            .build();

        await this.userRepo.save(newUser);
    }
}
