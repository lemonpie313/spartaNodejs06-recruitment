import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma.util.js';
import { MESSAGES } from '../const/messages.const.js';

export default async function (req, res, next) {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(401).json({ status: 401, message: MESSAGES.JWT.NONE });
    }

    const [tokenType, accessToken] = authorization.split(' ');

    if (tokenType !== 'Bearer') {
      return res.status(401).json({ status: 401, message: MESSAGES.JWT.NOT_TYPE });
    }

    if (!accessToken) {
      return res.status(401).json({ status: 401, message: MESSAGES.JWT.NONE });
    }

    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY);
    const userId = decodedToken.id;

    const user = await prisma.UserInfos.findFirst({
      where: { userId: +userId },
      select: {
        userId: true,
        role: true,
      },
    });
    if (!user) {
      return res.status(401).json({ status: 401, message: MESSAGES.JWT.NO_MATCH });
    }

    req.user = user;
    next();
  } catch (err) {
    switch (err.name) {
      case 'TokenExpiredError':
        return res.status(401).json({ status: 401, message: MESSAGES.JWT.EXPIRED });
      case 'JsonWebTokenError':
        return res.status(401).json({ status: 401, message: MESSAGES.JWT.NOT_AVAILABLE });
      default:
        return res.status(401).json({
          status: 401,
          message: err.message ?? MESSAGES.JWT.ELSE,
        });
    }
  }
}
