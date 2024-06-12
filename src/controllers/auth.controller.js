import { MESSAGES } from '../const/messages.const.js';
import { HTTP_STATUS } from '../const/http-status.const.js';

export class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  //회원가입
  signUp = async (req, res, next) => {
    try {
      const { email, password, name } = req.body;
      const userInfo = await this.authService.signUp(email, password, name);
      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: MESSAGES.AUTH.SIGN_UP.SUCCEED,
        data: { userInfo },
      });
    } catch (err) {
      next(err);
    }
  };

  //로그인
  signIn = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { accessToken, refreshToken } = await this.authService.signIn(email, password);
      res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.AUTH.SIGN_IN.SUCCEED,
        data: { accessToken, refreshToken },
      });
    } catch (err) {
      next(err);
    }
  };

  //토큰 재발급
  refreshToken = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { accessToken, refreshToken } = await this.authService.refreshToken(userId);
      res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.AUTH.TOKEN.SUCCEED,
        data: { accessToken, refreshToken },
      });
    } catch (err) {
      next(err);
    }
  };

  //로그아웃
  logOut = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const logOutUser = await this.authService.logOut(userId);
      res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.AUTH.LOGOUT.SUCCEED,
        data: logOutUser,
      });
    } catch (err) {
      next(err);
    }
  };
}
