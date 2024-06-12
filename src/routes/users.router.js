import express from 'express';
import authMiddleware from '../middlewares/access-token.middleware.js';
import { UserController } from '../controllers/user.controller.js';

const userController = new UserController();
const router = express.Router();

/* 회원정보 조회 */
router.get('/', authMiddleware, userController.getUserInfo);

export default router;
