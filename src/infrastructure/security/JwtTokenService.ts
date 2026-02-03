import jwt from 'jsonwebtoken';

import { AuthToken } from '../../domain/entities/auth/AuthToken.js';
import type { User } from '../../domain/entities/user/User.js';
import type { JwtPayload,TokenService } from '../../domain/services/TokenService.js';
import { config } from '../../shared/config.js';

export class JwtTokenService implements TokenService {
    generate(user: User): AuthToken {
        const payload: JwtPayload = {
            userId: user.id,
            username: user.username,
            isSigma: user.isSigma
        };

        const accessToken = jwt.sign(payload, config.jwt.secret, { 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expiresIn: config.jwt.accessExpiration as any
        });
        
        const refreshToken = jwt.sign({ userId: user.id }, config.jwt.refreshSecret, { 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expiresIn: config.jwt.refreshExpiration as any
        });

        // Calculate absolute expiration date for the response
        const now = new Date();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decodedAccess = jwt.decode(accessToken) as any;
        const exp = decodedAccess?.exp ? new Date(decodedAccess.exp * 1000) : new Date(now.getTime() + 15 * 60000);

        return AuthToken.builder
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .expiresIn(exp)
            .userId(user.id)
            .build();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    verify(token: string): any {
        return jwt.verify(token, config.jwt.secret) as JwtPayload;
    }
    
    decode(token: string): JwtPayload | null {
        return jwt.decode(token) as JwtPayload;
    }
}
