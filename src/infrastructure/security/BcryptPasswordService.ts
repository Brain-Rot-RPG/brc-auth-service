import bcrypt from 'bcrypt';

import type { PasswordService } from '../../domain/services/PasswordService.js';

export class BcryptPasswordService implements PasswordService {
    private readonly rounds = 10;

    async hash(raw: string): Promise<string> {
        return bcrypt.hash(raw, this.rounds);
    }

    async compare(raw: string, hash: string): Promise<boolean> {
        return bcrypt.compare(raw, hash);
    }
}
