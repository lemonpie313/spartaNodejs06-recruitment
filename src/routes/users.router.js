import express from 'express';
import authMiddleware from '../middlewares/access-token.middleware.js';
import { prisma } from '../utils/prisma.util.js';
import { AuthRepository } from '../repositories/auth.repository.js';
import { UserService } from '../services/user.service.js';
import { UserController } from '../controllers/user.controller.js';

const router = express.Router();

const authRepository = new AuthRepository(prisma);
const userService = new UserService(authRepository);
const userController = new UserController(userService);

/* 회원정보 조회 */
router.get('/', authMiddleware, userController.getUserInfo);

export default router;
