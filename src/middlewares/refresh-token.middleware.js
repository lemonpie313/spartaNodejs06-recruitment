import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prisma } from '../utils/prisma.util.js';
import { AuthRepository } from '../repositories/auth.repository.js';
import { MESSAGES } from '../const/messages.const.js';
import { HttpError } from '../error/http.error.js';

export default async function (req, res, next) {
  try {
    const authRepository = new AuthRepository(prisma);
    const authorization = req.headers.authorization;
    if (!authorization) {
      throw new HttpError.Unauthorized(MESSAGES.JWT.NONE);
    }

    const [tokenType, refreshToken] = authorization.split(' ');

    if (tokenType !== 'Bearer') {
      throw new HttpError.Unauthorized(MESSAGES.JWT.NOT_TYPE);
    }
    if (!refreshToken) {
      throw new HttpError.Unauthorized(MESSAGES.JWT.NONE);
    }

    const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);
    const userId = decodedToken.id;

    const tokenUser = await authRepository.findTokenById(userId);
    if (!tokenUser) {
      throw new HttpError.Unauthorized(MESSAGES.JWT.EXPIRED);
    }
    if (!(await bcrypt.compareSync(refreshToken, tokenUser.token))) {
      await authRepository.deleteToken(userId);
      throw new HttpError.Unauthorized(MESSAGES.JWT.DISCARDED);
    }

    const user = await authRepository.findUserInfoById(userId);
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}
