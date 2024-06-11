import express from 'express';
import { prisma } from '../utils/prisma.util.js';
import authMiddleware from '../middlewares/access-token.middleware.js';
import { MESSAGES } from '../const/messages.const.js';
import { HTTP_STATUS } from '../const/http-status.const.js';

const router = express.Router();

/* 회원정보 조회 */
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const user = req.user;
    const userInfo = await prisma.UserInfos.findFirst({
      where: {
        userId: +user.userId,
      },
      select: {
        userId: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.AUTH.READ.SUCCEED,
      data: { userInfo },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
