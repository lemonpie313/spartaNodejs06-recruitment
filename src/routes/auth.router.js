import express from 'express';
import refreshMiddleware from '../middlewares/refresh-token.middleware.js';
import { signUpValidator, signInValidator } from '../middlewares/joi/auth.joi.middleware.js';
import { AuthController } from '../controllers/auth.controller.js';

const authController = new AuthController();
const router = express.Router();

/* 회원가입 */
router.post('/sign-up', signUpValidator, authController.signUp);

/* 로그인 */
router.post('/sign-in', signInValidator, authController.signIn);

/* 토큰 재발급 */
router.get('/refresh', refreshMiddleware, authController.refreshToken);

/* 로그아웃 */
router.delete('/log-out', refreshMiddleware, authController.logOut);

export default router;
