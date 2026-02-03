import { Router } from 'express';

import type { AuthController } from '../controllers/AuthController.js';
import type { AuthMiddleware } from '../middlewares/AuthMiddleware.js';
import { validateBody } from '../middlewares/BodyValidator.js';
import { AuthRequestValidators } from '../validators/AuthRequestValidators.js';

export function createAuthRouter(authController: AuthController, authMiddleware: AuthMiddleware): Router {
    const router = Router();

    router.post('/register', validateBody(AuthRequestValidators.register), authController.register);
    router.post('/login', validateBody(AuthRequestValidators.login), authController.login);
  
    router.post('/logout', validateBody(AuthRequestValidators.refreshToken), authMiddleware.verify, authController.logout);
    router.post('/refresh', validateBody(AuthRequestValidators.refreshToken), authController.refresh);
  
    router.get('/validate', authMiddleware.verify, authController.validate);
  
    router.get('/users/me', authMiddleware.verify, authController.getMe);
    router.patch('/users/me', authMiddleware.verify, validateBody(AuthRequestValidators.updateProfile), authController.updateMe);

    return router;
}
