import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma.util.js';
import bcrypt from 'bcrypt';
import dotEnv from 'dotenv';

dotEnv.config();

export default async function (req, res, next) {
  try {
    const { Refresh } = req.cookies;
    if (!Refresh) throw new Error('인증 정보가 없습니다.');

    const [tokenType, tokenRaw] = Refresh.split(' ');
    if (tokenType !== 'Bearer') throw new Error('지원하지 않는 인증방식입니다.');

    const decodedToken = jwt.verify(tokenRaw, process.env.REFRESH_TOKEN_SECRET_KEY);
    const userId = decodedToken.id;
    console.log(userId);

    const tokenUser = await prisma.RefreshToken.findFirst({
      where: {
        userId: +userId,
      },
      select: {
        userId: true,
        token: true,
        expiresAt: true,
      },
    });

    if (!tokenUser) {
      res.clearCookie('Refresh');
      throw new Error('인증 정보와 일치하는 사용자가 없습니다.');
    }

    const date = new Date();
    console.log(date);
    console.log(tokenUser.expiresAt);

    if (!(await bcrypt.compare(tokenRaw, tokenUser.token)) || tokenUser.expiresAt < date) {
      res.clearCookie('Refresh');
      await prisma.RefreshToken.delete({
        where: {
          userId: +userId,
        },
        select: {
          userId: true,
        },
      });
      throw new Error('폐기된 인증정보입니다.');
    }

    req.user = tokenUser;
    next();
  } catch (err) {
    res.clearCookie('Refresh');

    switch (err.name) {
      case 'TokenExpiredError':
        return res.status(401).json({ status: 401, message: '인증 정보가 만료되었습니다.' });
      case 'JsonWebTokenError':
        return res.status(401).json({ status: 401, message: '인증 정보가 유효하지 않습니다.' });
      default:
        return res.status(401).json({
          status: 401,
          message: err.message ?? '비정상적인 접근입니다.',
        });
    }
  }
}
