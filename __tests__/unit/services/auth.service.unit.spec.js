import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { AuthService } from '../../../src/services/auth.service.js';
import { dummyUsers } from '../../dummies/users.dummy.js';
import { MESSAGES } from '../../../src/const/messages.const.js';
import { HttpError } from '../../../src/error/http.error.js';
import dotEnv from 'dotenv';

dotEnv.config();

const mockAuthRepository = {
  findUserInfoByEmail: jest.fn(),
  createUserInfo: jest.fn(),
  upsertToken: jest.fn(),
  deleteToken: jest.fn(),
};

const authService = new AuthService(mockAuthRepository);

describe('Auth Service Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  //회원가입
  test('signUp', async () => {
    const mockReturn = dummyUsers.create.return;
    mockAuthRepository.createUserInfo.mockReturnValue(mockReturn);

    const signUpParams = dummyUsers.create.params;
    const userInfo = await authService.signUp(signUpParams.email, signUpParams.password, signUpParams.name);

    expect(userInfo).toEqual({
      userId: mockReturn.userId,
      email: mockReturn.email,
      name: mockReturn.name,
      role: mockReturn.role,
      createdAt: mockReturn.createdAt,
      updatedAt: mockReturn.updatedAt,
    });

    expect(mockAuthRepository.findUserInfoByEmail).toHaveBeenCalledTimes(1);
    expect(mockAuthRepository.findUserInfoByEmail).toHaveBeenCalledWith(signUpParams.email);

    expect(mockAuthRepository.createUserInfo).toHaveBeenCalledTimes(1);
    expect(mockAuthRepository.createUserInfo).toHaveBeenCalled();
  });

  //회원가입 실패: 이메일 존재
  test('signUp', async () => {
    const mockReturn = dummyUsers.create.return;
    mockAuthRepository.findUserInfoByEmail.mockReturnValue(mockReturn);
    const signUpParams = dummyUsers.create.params;
    try {
      const userInfo = await authService.signUp(signUpParams.email, signUpParams.password, signUpParams.name);
    } catch (err) {
      expect(mockAuthRepository.findUserInfoByEmail).toHaveBeenCalledTimes(1);
      expect(mockAuthRepository.findUserInfoByEmail).toHaveBeenCalledWith(signUpParams.email);
      expect(err).toEqual(new HttpError.Conflict(MESSAGES.AUTH.COMMON.EMAIL.DUPLICATED));
    }
  });

  //로그인
  test('signIn', async () => {
    const mockReturn = dummyUsers.findFirst.return;
    mockAuthRepository.findUserInfoByEmail.mockReturnValue(mockReturn);

    const signInParams = dummyUsers.signIn.params.success;
    const { accessToken, refreshToken } = await authService.signIn(signInParams.email, signInParams.password);

    expect(mockAuthRepository.findUserInfoByEmail).toHaveBeenCalledTimes(1);
    expect(mockAuthRepository.findUserInfoByEmail).toHaveBeenCalledWith(signInParams.email);
  });

  //로그인 실패 : 이메일 존재x
  test('signIn', async () => {
    const mockReturn = undefined;
    mockAuthRepository.findUserInfoByEmail.mockReturnValue(mockReturn);
    const signInParams = dummyUsers.signIn.params.fail;
    try {
      const { accessToken, refreshToken } = await authService.signIn(signInParams.email, signInParams.password);
    } catch (err) {
      expect(mockAuthRepository.findUserInfoByEmail).toHaveBeenCalledTimes(1);
      expect(mockAuthRepository.findUserInfoByEmail).toHaveBeenCalledWith(signInParams.email);
      expect(err).toEqual(new HttpError.NotFound(MESSAGES.AUTH.SIGN_IN.IS_NOT_EXIST));
    }
  });

  //로그인 실패 : 비번 틀림
  test('signIn', async () => {
    const mockReturn = dummyUsers.findFirst.return;
    mockAuthRepository.findUserInfoByEmail.mockReturnValue(mockReturn);
    const signInParams = dummyUsers.signIn.params.fail;
    try {
      const { accessToken, refreshToken } = await authService.signIn(signInParams.email, signInParams.password);
    } catch (err) {
      expect(mockAuthRepository.findUserInfoByEmail).toHaveBeenCalledTimes(1);
      expect(mockAuthRepository.findUserInfoByEmail).toHaveBeenCalledWith(signInParams.email);
      expect(err).toEqual(new HttpError.Unauthorized(MESSAGES.AUTH.SIGN_IN.PW_NOT_MATCHED));
    }
  });

  test('refreshToken', async () => {
    const mockReturn = 'mockReturnTest';
    mockAuthRepository.upsertToken.mockReturnValue(mockReturn);

    const refreshTokenParams = 1;
    const { accessToken, refreshToken } = await authService.refreshToken(refreshTokenParams);
    expect(mockAuthRepository.upsertToken).toHaveBeenCalledTimes(1);
  });

  test('logOut', async () => {
    const mockReturn = dummyUsers.logOut.return;
    mockAuthRepository.deleteToken.mockReturnValue(mockReturn);

    const logOutParams = dummyUsers.logOut.params.userId;
    const userId = await authService.logOut(logOutParams);

    expect(userId).toEqual({
      userId: mockReturn.userId,
    });
    expect(mockAuthRepository.deleteToken).toHaveBeenCalledTimes(1);
    expect(mockAuthRepository.deleteToken).toHaveBeenCalledWith(logOutParams);
  });
});
