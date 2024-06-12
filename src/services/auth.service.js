import { AuthRepository } from '../repositories/auth.repository.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthService {
  authRepository = new AuthRepository();

  //회원가입
  signUp = async (email, password, name) => {
    const isExistEmail = await this.authRepository.findUserInfoByEmail(email);
    if (isExistEmail) {
      throw new Error('이미 존재하는 이메일입니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userInfo = await this.authRepository.createUserInfo(email, hashedPassword, name);
    return {
      userId: userInfo.userId,
      email: userInfo.email,
      name: userInfo.name,
      role: userInfo.role,
      createdAt: userInfo.createdAt,
      updatedAt: userInfo.updatedAt,
    };
  };

  //로그인
  signIn = async (email, password) => {
    const user = await this.authRepository.findUserInfoByEmail(email);
    if (!user) {
      throw new Error('존재하지 않는 이메일입니다.');
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new Error('비밀번호가 일치하지 않습니다.');
    }
    const { accessToken, refreshToken } = await this.refreshToken(user.userId);
    return { accessToken, refreshToken };
  };

  //토큰 발급
  refreshToken = async (userId) => {
    const payload = { id: userId };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '12h' });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: '7d' });
    const refreshTokenHashed = await bcrypt.hash(refreshToken, 10);
    await this.authRepository.upsertToken(userId, refreshTokenHashed);
    return { accessToken, refreshToken };
  };

  //로그아웃
  logOut = async (userId) => {
    const logOutUser = await this.authRepository.deleteToken(userId);
    return {
      userId: logOutUser.userId,
    };
  };
}
