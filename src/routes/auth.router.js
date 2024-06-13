import express from 'express';
import refreshMiddleware from '../middlewares/refresh-token.middleware.js';
import { signUpValidator, signInValidator } from '../middlewares/joi/auth.joi.middleware.js';
import { prisma } from '../utils/prisma.util.js';
import { AuthRepository } from '../repositories/auth.repository.js';
import { AuthService } from '../services/auth.service.js';
import { AuthController } from '../controllers/auth.controller.js';

const router = express.Router();

const authRepository = new AuthRepository(prisma);
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

/* 회원가입 */
router.post('/sign-up', signUpValidator, authController.signUp);

/* 로그인 */
router.post('/sign-in', signInValidator, authController.signIn);

/* 토큰 재발급 */
router.get('/refresh', refreshMiddleware, authController.refreshToken);

/* 로그아웃 */
router.delete('/log-out', refreshMiddleware, authController.logOut);

export default router;
