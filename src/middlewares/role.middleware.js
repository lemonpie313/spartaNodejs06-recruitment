import { MESSAGES } from '../const/messages.const.js';
import { HTTP_STATUS } from '../const/http-status.const.js';
import { HttpError } from '../error/http.error.js';

const requireRoles = function (requireRole) {
  return async function (req, res, next) {
    try {
      const { userId, role } = req.user;
      if (!requireRole.includes(role)) {
        throw new HttpError.Forbidden(MESSAGES.ROLE.FORBIDDEN);
      }

      req.user = { userId };
      return next();
    } catch (err) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        status: HTTP_STATUS.FORBIDDEN,
        message: err.message ?? MESSAGES.ROLE.ERROR,
      });
    }
  };
};

export default requireRoles;
