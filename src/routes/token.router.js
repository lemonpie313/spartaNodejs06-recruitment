import express from 'express';
import dotEnv from 'dotenv';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma.util.js';
import bcrypt from 'bcrypt';
import tokenMiddleware from '../middlewares/token.middleware.js';

dotEnv.config();
const router = express.Router();

router.get('/refresh', tokenMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.user;

    const accessToken = jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '12h' });
    res.cookie('Authorization', `Bearer ${accessToken}`);

    const refreshTokenRaw = jwt.sign(
      {
        id: userId,
      },
      process.env.REFRESH_TOKEN_SECRET_KEY,
      { expiresIn: '7d' },
    );

    const refreshToken = await bcrypt.hash(`${refreshTokenRaw}`, 10);
    res.cookie('Refresh', `Bearer ${refreshTokenRaw}`);

    const date = new Date();
    date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000);

    await prisma.RefreshToken.update({
      data: {
        token: refreshToken,
        expiresAt: date,
      },
      where: {
        userId,
      },
    });

    res.status(200).json({
      status: 200,
      message: '토큰 생성이 완료되었습니다.',
    });
  } catch (err) {
    next(err);
  }
});

export default router;
