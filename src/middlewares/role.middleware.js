import { MESSAGES } from '../const/messages.const.js';
import { HTTP_STATUS } from '../const/http-status.const.js';

const requireRoles = function (requireRole) {
  return async function (req, res, next) {
    try {
      const { userId, role } = req.user;
      if (!requireRole.includes(role)) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
          status: HTTP_STATUS.FORBIDDEN,
          message: MESSAGES.ROLE.FORBIDDEN,
        });
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
