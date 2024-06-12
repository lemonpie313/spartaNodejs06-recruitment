import { MESSAGES } from '../const/messages.const.js';
import { HTTP_STATUS } from '../const/http-status.const.js';

export class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  // 회원정보 조회
  getUserInfo = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const userInfo = await this.userService.findUserInfo(userId);
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.AUTH.READ.SUCCEED,
        data: { userInfo },
      });
    } catch (err) {
      next(err);
    }
  };
}
