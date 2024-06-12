import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma.util.js';
import { AuthRepository } from '../repositories/auth.repository.js';
import bcrypt from 'bcrypt';
import { MESSAGES } from '../const/messages.const.js';
import { HTTP_STATUS } from '../const/http-status.const.js';

export default async function (req, res, next) {
  try {
    const authRepository = new AuthRepository();
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ status: HTTP_STATUS.UNAUTHORIZED, message: MESSAGES.JWT.NONE });
    }

    const [tokenType, refreshToken] = authorization.split(' ');

    if (tokenType !== 'Bearer') {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ status: HTTP_STATUS.UNAUTHORIZED, message: MESSAGES.JWT.NOT_TYPE });
    }
    if (!refreshToken) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ status: HTTP_STATUS.UNAUTHORIZED, message: MESSAGES.JWT.NONE });
    }

    const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);
    const userId = decodedToken.id;

    const tokenUser = await authRepository.findTokenById(userId);
    if (!tokenUser) {
      throw new Error('인증 정보가 만료되었습니다.');
    }
    if (!(await bcrypt.compareSync(refreshToken, tokenUser.token))) {
      await authRepository.deleteToken(userId);
      throw new Error('폐기된 인증정보입니다.');
    }

    const user = await authRepository.findUserInfoById(userId);
    req.user = user;
    next();
  } catch (err) {
    switch (err.name) {
      case 'TokenExpiredError':
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ status: HTTP_STATUS.UNAUTHORIZED, message: '인증 정보가 만료되었습니다.' });
      case 'JsonWebTokenError':
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ status: HTTP_STATUS.UNAUTHORIZED, message: '인증 정보가 유효하지 않습니다.' });
      default:
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          status: HTTP_STATUS.UNAUTHORIZED,
          message: err.message ?? '비정상적인 접근입니다.',
        });
    }
  }
}
