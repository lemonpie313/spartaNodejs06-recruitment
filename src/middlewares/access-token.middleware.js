import jwt from 'jsonwebtoken';
import { AuthRepository } from '../repositories/auth.repository.js';
import { MESSAGES } from '../const/messages.const.js';
import { HTTP_STATUS } from '../const/http-status.const.js';
import { HttpError } from '../error/http.error.js';

export default async function (req, res, next) {
  try {
    const authRepository = new AuthRepository();
    const authorization = req.headers.authorization;
    if (!authorization) {
      throw new HttpError.BadRequest(MESSAGES.JWT.NONE);
    }

    const [tokenType, accessToken] = authorization.split(' ');

    if (tokenType !== 'Bearer') {
      throw new HttpError.Unauthorized(MESSAGES.JWT.NOT_TYPE);
    }

    if (!accessToken) {
      throw new HttpError.Unauthorized(MESSAGES.JWT.NONE);
    }

    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY);
    const userId = decodedToken.id;

    const user = await authRepository.findUserInfoById(userId);
    if (!user) {
      throw new HttpError.Unauthorized(MESSAGES.JWT.NO_MATCH);
    }

    req.user = user;
    next();
  } catch (err) {
    switch (err.name) {
      case 'TokenExpiredError':
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ status: HTTP_STATUS.UNAUTHORIZED, message: MESSAGES.JWT.EXPIRED });
      case 'JsonWebTokenError':
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ status: HTTP_STATUS.UNAUTHORIZED, message: MESSAGES.JWT.NOT_AVAILABLE });
      default:
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          status: HTTP_STATUS.UNAUTHORIZED,
          message: err.message ?? MESSAGES.JWT.ELSE,
        });
    }
  }
}
