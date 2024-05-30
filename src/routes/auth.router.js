import express from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma.util.js';
import bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import authMiddleware from '../middlewares/access-token.middleware.js';
import tokenMiddleware from '../middlewares/refresh-token.middleware.js';
import { MESSAGES } from '../const/messages.const.js';
import { signUpValidator, signInValidator } from '../middlewares/joi/auth.joi.middleware.js';
//import { signInValidator } from '../middlewares/joi/sign-in.joi.middleware.js';

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
      return res.status(409).json({ status: 409, message: MESSAGES.AUTH.SIGN_UP.ISEXIST });
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
      message: MESSAGES.AUTH.SIGN_UP.SUCCEED,
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
    const user = await prisma.Users.findFirst({
      where: {
        email,
      },
      select: {
        userId: true,
        password: true,
      },
    });
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: MESSAGES.AUTH.SIGN_IN.ISNOTEXIST,
      });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({
        status: 400,
        message: MESSAGES.AUTH.SIGN_IN.PW_NOT_MATCHED,
      });
    }

    const payload = { id: user.userId };
    const data = await token(payload);

    res.status(200).json({
      status: 200,
      message: MESSAGES.AUTH.SIGN_IN.SUCCEED,
      data,
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
      message: MESSAGES.AUTH.READ.SUCCEED,
      data: { userInfo },
    });
  } catch (err) {
    next(err);
  }
});

/* 토큰 재발급 */
router.get('/refresh', tokenMiddleware, async (req, res, next) => {
  try {
    const user = req.user;

    const payload = { id: user.userId };

    const data = await token(payload);

    res.status(200).json({
      status: 200,
      message: '토큰 생성이 완료되었습니다.',
      data,
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
    message: MESSAGES.AUTH.LOGOUT.SUCCEED,
    data: logOutUser,
  });
});

const token = async function (payload) {
  const userId = payload.id;
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '12h' });

  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: '7d' });

  const refreshTokenHashed = await bcrypt.hash(`${refreshToken}`, 10);

  await prisma.RefreshToken.upsert({
    where: {
      userId,
    },
    update: {
      token: refreshTokenHashed,
    },
    create: {
      userId,
      token: refreshTokenHashed,
    },
  });

  return { accessToken, refreshToken };
};

export default router;
