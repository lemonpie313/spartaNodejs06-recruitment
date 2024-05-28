import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma.util.js';
import dotEnv from 'dotenv';

dotEnv.config();

export default async function (req, res, next) {
  try {
    const { resumeAccessToken } = req.cookies;
    if (!resumeAccessToken) throw new Error('인증 정보가 없습니다.');

    const [tokenType, token] = resumeAccessToken.split(' ');

    if (tokenType !== 'Bearer') throw new Error('지원하지 않는 인증방식입니다.');

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
    const userId = decodedToken.id;

    const user = await prisma.UserInfos.findFirst({
      where: { userId: +userId },
      select: {
        userId: true,
        role: true,
      },
    });
    if (!user) {
      res.clearCookie('resumeAccessToken');
      throw new Error('인증 정보와 일치하는 사용자가 없습니다.');
    }

    // req.user에 사용자 정보를 저장합니다.
    req.user = user;
    next();
  } catch (err) {
    res.clearCookie('resumeAccessToken');

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
