import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { AuthController } from '../../../src/controllers/auth.controller.js';
import { dummyUsers } from '../../dummies/users.dummy.js';
import { HTTP_STATUS } from '../../../src/const/http-status.const.js';
import { MESSAGES } from '../../../src/const/messages.const.js';
import { empty } from '@prisma/client/runtime/library';

const mockAuthService = {
  signUp: jest.fn(),
  signIn: jest.fn(),
  refreshToken: jest.fn(),
  logOut: jest.fn(),
};

const mockRequest = {
  user: jest.fn(),
  body: jest.fn(),
  query: jest.fn(),
  params: jest.fn(),
};

const mockResponse = {
  status: jest.fn(),
  json: jest.fn(),
};

const mockNext = jest.fn();

const authController = new AuthController(mockAuthService);

describe('UserController Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    mockResponse.status.mockReturnValue(mockResponse);
  });

  //회원가입
  test('signUp', async () => {
    const sampleUserInfo = {
      userId: dummyUsers.create.return.userId,
      email: dummyUsers.create.return.email,
      name: dummyUsers.create.return.name,
      role: dummyUsers.create.return.role,
      createdAt: dummyUsers.create.return.createdAt,
      updatedAt: dummyUsers.create.return.updatedAt,
    };
    mockAuthService.signUp.mockReturnValue(sampleUserInfo);

    const signUpParams = dummyUsers.create.params;
    mockRequest.body = signUpParams;
    await authController.signUp(mockRequest, mockResponse, mockNext);

    expect(mockAuthService.signUp).toHaveBeenCalledTimes(1);
    expect(mockAuthService.signUp).toHaveBeenCalledWith(signUpParams.email, signUpParams.password, signUpParams.name);

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);

    expect(mockResponse.json).toHaveBeenCalledWith({
      status: HTTP_STATUS.CREATED,
      message: MESSAGES.AUTH.SIGN_UP.SUCCEED,
      data: { userInfo: sampleUserInfo },
    });
  });

  test('signIn', async () => {
    const sampleToken = {
      accessToken: 'accessTokenSample',
      refreshToken: 'refreshTokenSample',
    };
    mockAuthService.signIn.mockReturnValue(sampleToken);

    const signInParams = dummyUsers.signIn.params;
    mockRequest.body = signInParams;

    await authController.signIn(mockRequest, mockResponse, mockNext);

    expect(mockAuthService.signIn).toHaveBeenCalledTimes(1);
    expect(mockAuthService.signIn).toHaveBeenCalledWith(signInParams.email, signInParams.password);

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.OK);

    expect(mockResponse.json).toHaveBeenCalledWith({
      status: HTTP_STATUS.OK,
      message: MESSAGES.AUTH.SIGN_IN.SUCCEED,
      data: { accessToken: sampleToken.accessToken, refreshToken: sampleToken.refreshToken },
    });
  });

  test('refreshToken', async () => {
    const sampleToken = {
      accessToken: 'accessTokenSample',
      refreshToken: 'refreshTokenSample',
    };
    mockAuthService.refreshToken.mockReturnValue(sampleToken);

    const params = 1;
    mockRequest.user = { userId: params };
    await authController.refreshToken(mockRequest, mockResponse, mockNext);

    expect(mockAuthService.refreshToken).toHaveBeenCalledTimes(1);
    expect(mockAuthService.refreshToken).toHaveBeenCalledWith(params);

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.OK);

    expect(mockResponse.json).toHaveBeenCalledWith({
      status: HTTP_STATUS.OK,
      message: MESSAGES.AUTH.TOKEN.SUCCEED,
      data: { accessToken: sampleToken.accessToken, refreshToken: sampleToken.refreshToken },
    });
  });

  test('logOut', async () => {
    const sampleLogOutUserId = dummyUsers.logOut.return.userId;
    mockAuthService.logOut.mockReturnValue(sampleLogOutUserId);

    const params = dummyUsers.logOut.params.userId;
    mockRequest.user = { userId: params };
    await authController.logOut(mockRequest, mockResponse, mockNext);

    expect(mockAuthService.logOut).toHaveBeenCalledTimes(1);
    expect(mockAuthService.logOut).toHaveBeenCalledWith(params);

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.OK);

    expect(mockResponse.json).toHaveBeenCalledWith({
      status: HTTP_STATUS.OK,
      message: MESSAGES.AUTH.LOGOUT.SUCCEED,
      data: sampleLogOutUserId,
    });
  });
});
