import express from 'express';
import dotEnv from 'dotenv';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma.util.js';
import bcrypt from 'bcrypt';
import authMiddleware from '../middlewares/auth.middleware.js';
import { Prisma } from '@prisma/client';

dotEnv.config();
const router = express.Router();

/* 회원가입 */
router.post('/sign-up', async (req, res, next) => {
  try {
    //req.body에서 정보 받아오기
    const { email, password, passwordConfirm, name } = req.body;

    //정보 기입 오류 시 에러
    if (!email) {
      return res.status(400).json({ status: 400, message: '이메일 주소를 입력해주세요.' });
    } else if (!password) {
      return res.status(400).json({ status: 400, message: '비밀번호를 입력해주세요.' });
    } else if (!passwordConfirm) {
      return res.status(400).json({ status: 400, message: '비밀번호 확인을 입력해주세요.' });
    } else if (!name) {
      return res.status(400).json({ status: 400, message: '이름을 입력해주세요.' });
    }

    const isExistEmail = await prisma.Users.findFirst({
      where: {
        email,
      },
    });
    if (isExistEmail) {
      return res.status(409).json({ status: 409, message: '이미 가입된 사용자입니다.' });
    }
    const pattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;
    if (!pattern.test(email)) {
      return res.status(400).json({ status: 400, message: '이메일 형태가 올바르지 않습니다.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ status: 400, message: '비밀번호는 6자리 이상이어야 합니다.' });
    }
    if (password != passwordConfirm) {
      return res.status(400).json({ status: 400, message: '비밀번호가 일치하지 않습니다' });
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
router.post('/sign-in', async (req, res, next) => {
  try {
    //req.body에서 정보 받아오기
    const { email, password } = req.body;

    //정보 기입 오류 에러처리
    if (!email) {
      return res.status(400).json({ status: 400, message: '이메일 주소를 입력해주세요.' });
    } else if (!password) {
      return res.status(400).json({ status: 400, message: '비밀번호를 입력해주세요.' });
    }

    const pattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;
    if (!pattern.test(email)) {
      return res.status(400).json({
        status: 400,
        message: '이메일 형태가 올바르지 않습니다.',
      });
    }

    //해당하는 회원 정보 가져오기
    const userInfo = await prisma.Users.findFirst({
      where: {
        email,
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

    //accessToken 발급 및 반환
    const accessToken = jwt.sign({ id: userInfo.userId }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '12h' });
    res.cookie('resumeAccessToken', `Bearer ${accessToken}`);

    //반환
    res.status(200).json({
      status: 200,
      message: '로그인에 완료되었습니다.',
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

export default router;
