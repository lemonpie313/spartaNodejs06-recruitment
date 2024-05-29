import express from 'express';
import dotEnv from 'dotenv';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma.util.js';
import bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import authMiddleware from '../middlewares/auth.middleware.js';
import tokenMiddleware from '../middlewares/token.middleware.js';
import { signUpValidator, signInValidator } from '../middlewares/joi/auth.joi.middleware.js';
//import { signInValidator } from '../middlewares/joi/sign-in.joi.middleware.js';

dotEnv.config();
const router = express.Router();

/* 회원가입 */
router.post('/sign-up', signUpValidator, async (req, res, next) => {
  try {
    //req.body에서 정보 받아오기
    const { email, password, name } = req.body;

    const isExistEmail = await prisma.Users.findFirst({
      where: {
        email,
      },
    });
    if (isExistEmail) {
      return res.status(409).json({ status: 409, message: '이미 가입된 사용자입니다.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userInfo = await prisma.$transaction(
      async (tx) => {
        const user = await tx.Users.create({
          data: {
            email,
            password: hashedPassword,
          },
        });
        const userInfo = await tx.UserInfos.create({
          data: {
            userId: user.userId,
            email,
            name,
            password: hashedPassword,
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
        return userInfo;
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      },
    );

    return res.status(201).json({
      status: 201,
      message: '회원가입이 완료되었습니다.',
      data: { userInfo },
    });
  } catch (err) {
    next(err);
  }
});

/* 로그인 */
router.post('/sign-in', signInValidator, async (req, res, next) => {
  try {
    //req.body에서 정보 받아오기
    const { email, password } = req.body;

    //해당하는 회원 정보 가져오기
    const userInfo = await prisma.Users.findFirst({
      where: {
        email,
      },
      select: {
        userId: true,
        password: true,
      },
    });
    if (!userInfo) {
      return res.status(404).json({
        status: 404,
        message: '회원 정보를 찾을 수 없습니다.',
      });
    }
    if (!(await bcrypt.compare(password, userInfo.password))) {
      return res.status(400).json({
        status: 400,
        message: '비밀번호가 일치하지 않습니다.',
      });
    }

    //accessToken, refreshToken 발급 및 반환
    const accessToken = jwt.sign({ id: userInfo.userId }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '12h' });
    res.cookie('Authorization', `Bearer ${accessToken}`);

    const refreshTokenRaw = jwt.sign(
      {
        id: userInfo.userId,
      },
      process.env.REFRESH_TOKEN_SECRET_KEY,
      { expiresIn: '7d' },
    );

    const refreshToken = await bcrypt.hash(`${refreshTokenRaw}`, 10);
    res.cookie('Refresh', `Bearer ${refreshTokenRaw}`);

    const date = new Date();
    date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000);
    const isAlreadyToken = await prisma.RefreshToken.findFirst({
      where: {
        userId: userInfo.userId,
      },
    });

    if (!isAlreadyToken) {
      await prisma.RefreshToken.create({
        data: {
          userId: userInfo.userId,
          token: refreshToken,
          expiresAt: date,
        },
      });
    } else {
      await prisma.RefreshToken.update({
        data: {
          token: refreshToken,
          expiresAt: date,
        },
        where: {
          userId: userInfo.userId,
        },
      });
    }

    //반환
    res.status(200).json({
      status: 200,
      message: '로그인 되었습니다.',
    });
  } catch (err) {
    next(err);
  }
});

/* 회원정보 조회 */
router.get('/my-page', authMiddleware, async (req, res, next) => {
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
    return res.status(201).json({
      status: 201,
      message: '회원정보 조회에 성공하였습니다.',
      data: { userInfo },
    });
  } catch (err) {
    next(err);
  }
});

/* 로그아웃 */
router.delete('/log-out', tokenMiddleware, async (req, res, next) => {
  const { userId } = req.user;
  const logOutUser = await prisma.RefreshToken.delete({
    where: {
      userId,
    },
    select: {
      userId: true,
    },
  });
  res.clearCookie('Refresh');
  res.clearCookie('Authorization');
  res.status(200).json({
    status: 200,
    message: '로그아웃 되었습니다.',
    data: logOutUser,
  });
});

export default router;
