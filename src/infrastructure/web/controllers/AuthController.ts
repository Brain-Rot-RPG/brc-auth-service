import type { NextFunction,Request, Response } from 'express';

import type { GetUserProfile } from '../../../application/use-cases/GetUserProfile.js';
import type { LoginUser } from '../../../application/use-cases/LoginUser.js';
import type { LogoutUser } from '../../../application/use-cases/LogoutUser.js';
import type { RefreshToken } from '../../../application/use-cases/RefreshToken.js';
import type { RegisterUser } from '../../../application/use-cases/RegisterUser.js';
import type { UpdateUser } from '../../../application/use-cases/UpdateUser.js';

export class AuthController {
    constructor(
        private readonly registerUC: RegisterUser,
        private readonly loginUC: LoginUser,
        private readonly logoutUC: LogoutUser,
        private readonly refreshUC: RefreshToken,
        private readonly getUserProfileUC: GetUserProfile,
        private readonly updateUserUC: UpdateUser
    ) {}

    register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await this.registerUC.execute(req.body);
            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            next(error);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const token = await this.loginUC.execute(req.body);
            res.status(200).json({
                accessToken: token.accessToken,
                refreshToken: token.refreshToken,
                expiresIn: token.expiresIn
            });
        } catch (error) {
            next(error);
        }
    };

    logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { refreshToken } = req.body;
            await this.logoutUC.execute(refreshToken);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };

    refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { refreshToken } = req.body;
            const token = await this.refreshUC.execute(refreshToken);
            res.status(200).json(token); // Ensure serialization matches AuthToken schema
        } catch (error) {
            next(error);
        }
    };

    validate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        // If we reach here, middleware passed, so token is valid.
        // We just return identity info.
        try {
            if (!req.user) {
                throw new Error('User context missing despite middleware');
            }
            res.status(200).json({
                userId: req.user.userId,
                username: req.user.username
            });
        } catch (error) {
            next(error);
        }
    };

    getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.user) throw new Error('User context missing');
            const userId = req.user.userId;
            const profile = await this.getUserProfileUC.execute(userId);
            res.status(200).json(profile);
        } catch (error) {
            next(error);
        }
    };

    updateMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.user) throw new Error('User context missing');
            const userId = req.user.userId;
            const profile = await this.updateUserUC.execute(userId, req.body);
            res.status(200).json(profile);
        } catch (error) {
            next(error);
        }
    };
}
