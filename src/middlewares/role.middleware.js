import { MESSAGES } from '../const/messages.const.js';
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
      next(err);
    }
  };
};

export default requireRoles;
