import express from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma.util.js';
import bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import authMiddleware from '../middlewares/access-token.middleware.js';
import refreshMiddleware from '../middlewares/refresh-token.middleware.js';
import { MESSAGES } from '../const/messages.const.js';
import { HTTP_STATUS } from '../const/http-status.const.js';
import { signUpValidator, signInValidator } from '../middlewares/joi/auth.joi.middleware.js';

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
      return res.status(HTTP_STATUS.CONFLICT).json({ status: HTTP_STATUS.CONFLICT, message: MESSAGES.AUTH.SIGN_UP.ISEXIST });
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

    return res.status(HTTP_STATUS.CREATED).json({
      status: HTTP_STATUS.CREATED,
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
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: HTTP_STATUS.NOT_FOUND,
        message: MESSAGES.AUTH.SIGN_IN.ISNOTEXIST,
      });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: HTTP_STATUS.BAD_REQUEST,
        message: MESSAGES.AUTH.SIGN_IN.PW_NOT_MATCHED,
      });
    }

    const payload = { id: user.userId };
    const data = await token(payload);

    res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.AUTH.SIGN_IN.SUCCEED,
      data,
    });
  } catch (err) {
    next(err);
  }
});

/* 회원정보 조회 */
router.get('/auth/my-page', authMiddleware, async (req, res, next) => {
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

/* 토큰 재발급 */
router.get('/refresh', refreshMiddleware, async (req, res, next) => {
  try {
    const user = req.user;

    const payload = { id: user.userId };

    const data = await token(payload);

    res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: '토큰 생성이 완료되었습니다.',
      data,
    });
  } catch (err) {
    next(err);
  }
});

/* 로그아웃 */
router.delete('/log-out', refreshMiddleware, async (req, res, next) => {
  const { userId } = req.user;
  const logOutUser = await prisma.RefreshToken.delete({
    where: {
      userId,
    },
    select: {
      userId: true,
    },
  });
  res.status(HTTP_STATUS.OK).json({
    status: HTTP_STATUS.OK,
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
