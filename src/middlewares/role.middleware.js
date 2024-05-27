const requireRoles = function (requireRole) {
  return async function (req, res, next) {
    try {
      const { userId, role } = req.user;
      console.log(requireRole);
      console.log(role);
      if (!requireRole.includes(role)) {
        throw new Error('접근 권한이 없습니다.');
      }

      req.user = { userId, role };
      return next();
    } catch (err) {
      return res.status(401).json({
        status: 401,
        message: err.message ?? '비정상적인 접근입니다.',
      });
    }
  };
};

export default requireRoles;
