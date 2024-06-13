import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { AuthService } from '../../../src/services/auth.service.js';
import { dummyUsers } from '../../dummies/users.dummy.js';
import dotEnv from 'dotenv';
import bcrypt from 'bcrypt';

dotEnv.config();

const mockAuthRepository = {
  findUserInfoByEmail: jest.fn(),
  createUserInfo: jest.fn(),
  upsertToken: jest.fn(),
  deleteToken: jest.fn(),
};

const authService = new AuthService(mockAuthRepository);

describe('TemplateService Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
  });

  test('signUp', async () => {
    const mockReturn = dummyUsers[1];
    mockAuthRepository.createUserInfo.mockReturnValue(mockReturn);

    const signUpParams = {
      email: dummyUsers[1].email,
      password: '000000',
      name: dummyUsers[1].name,
    };
    const userInfo = await authService.signUp(signUpParams.email, signUpParams.password, signUpParams.name);
    const hashedPassword = await bcrypt.hash(signUpParams.password, 10);

    expect(userInfo).toEqual({
      userId: mockReturn.userId,
      email: mockReturn.email,
      name: mockReturn.name,
      role: mockReturn.role,
      createdAt: mockReturn.createdAt,
      updatedAt: mockReturn.updatedAt,
    });
    expect(mockAuthRepository.createUserInfo).toHaveBeenCalledTimes(1);
    //expect(mockAuthRepository.createUserInfo).toHaveBeenCalledWith(signUpParams.email, /*해시된비번*/ signUpParams.name); // >> hash된 패스워드 어떻게...?

    expect(mockAuthRepository.findUserInfoByEmail).toHaveBeenCalledTimes(1);
    expect(mockAuthRepository.findUserInfoByEmail).toHaveBeenCalledWith(signUpParams.email);
  });
  //회원가입 실패: 이메일 존재

  test('signIn', async () => {
    const mockReturn = dummyUsers[1];
    mockAuthRepository.findUserInfoByEmail.mockReturnValue(mockReturn);

    const signInParams = {
      email: dummyUsers[1].email,
      password: '000000',
    };
    const { accessToken, refreshToken } = await authService.signIn(signInParams.email, signInParams.password);

    expect(mockAuthRepository.findUserInfoByEmail).toHaveBeenCalledTimes(1);
    expect(mockAuthRepository.findUserInfoByEmail).toHaveBeenCalledWith(signInParams.email);
  });
  //로그인 실패 : 이메일 존재x, 비번 틀림

  test('refreshToken', async () => {
    const mockReturn = 'mockReturnTest';
    mockAuthRepository.upsertToken.mockReturnValue(mockReturn);

    const refreshTokenParams = 1;
    const { accessToken, refreshToken } = await authService.refreshToken(refreshTokenParams);

    expect(mockAuthRepository.upsertToken).toHaveBeenCalledTimes(1);
  });
  //토큰 인증 실패 : 미들웨어에서 처리 다 할거임..

  test('logOut', async () => {
    const mockReturn = dummyUsers[1];
    mockAuthRepository.deleteToken.mockReturnValue(mockReturn);

    const logOutParams = 1;
    const userId = await authService.logOut(logOutParams);

    expect(userId).toEqual({
      userId: mockReturn.userId,
    });
    expect(mockAuthRepository.deleteToken).toHaveBeenCalledTimes(1);
    expect(mockAuthRepository.deleteToken).toHaveBeenCalledWith(logOutParams);
  });
});
