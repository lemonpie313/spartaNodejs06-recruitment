import { MESSAGES } from '../const/messages.const.js';
import { HTTP_STATUS } from '../const/http-status.const.js';

export default function (err, req, res, next) {
  console.error(err);
  if (err.name === 'ValidationError') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: HTTP_STATUS.BAD_REQUEST,
      message: err.message,
    });
  } else if (err.name == 'TokenExpiredError') {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      status: HTTP_STATUS.UNAUTHORIZED,
      message: MESSAGES.JWT.EXPIRED,
    });
  } else if (err.name == 'JsonWebTokenError') {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      status: HTTP_STATUS.UNAUTHORIZED,
      message: MESSAGES.JWT.NOT_AVAILABLE,
    });
  }

  return res.status(err.status).json({
    status: err.status,
    message: err.message,
  });
}
