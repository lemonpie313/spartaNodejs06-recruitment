import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma.util.js';
import bcrypt from 'bcrypt';
import { MESSAGES } from '../const/messages.const.js';

export default async function (req, res, next) {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(401).json({ status: 401, message: MESSAGES.JWT.NONE });
    }

    const [tokenType, refreshToken] = authorization.split(' ');

    if (tokenType !== 'Bearer') {
      return res.status(401).json({ status: 401, message: MESSAGES.JWT.NOT_TYPE });
    }
    if (!refreshToken) {
      return res.status(401).json({ status: 401, message: MESSAGES.JWT.NONE });
    }

    const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);
    const userId = decodedToken.id;

    const tokenUser = await prisma.refreshToken.findFirst({
      where: { userId: +userId },
      select: {
        userId: true,
        token: true,
      },
    });
    if (!tokenUser) {
      throw new Error('인증 정보가 만료되었습니다.');
    }
    if (!(await bcrypt.compareSync(refreshToken, tokenUser.token))) {
      res.clearCookie('Refresh');
      await prisma.RefreshToken.delete({
        where: {
          userId: +userId,
        },
      });
      throw new Error('폐기된 인증정보입니다.');
    }

    const user = await prisma.Users.findFirst({
      where: { userId: +userId },
      select: {
        userId: true,
      },
    });

    req.user = user;
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
