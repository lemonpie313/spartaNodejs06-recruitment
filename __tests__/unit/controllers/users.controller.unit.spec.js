import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { UserController } from '../../../src/controllers/user.controller.js';
import { dummyUsers } from '../../dummies/users.dummy.js';
import { HTTP_STATUS } from '../../../src/const/http-status.const.js';
import { MESSAGES } from '../../../src/const/messages.const.js';

const mockUserService = {
  findUserInfo: jest.fn(),
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

const userController = new UserController(mockUserService);

describe('UserController Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    mockResponse.status.mockReturnValue(mockResponse);
  });

  test('getUserInfo', async () => {
    const sampleUserInfo = dummyUsers.findFirst.return;
    const userId = dummyUsers.findFirst.params.userId;
    mockRequest.user = { userId: userId };
    mockUserService.findUserInfo.mockReturnValue(sampleUserInfo);

    await userController.getUserInfo(mockRequest, mockResponse, mockNext);

    expect(mockUserService.findUserInfo).toHaveBeenCalledTimes(1);
    expect(mockUserService.findUserInfo).toHaveBeenCalledWith(userId); //>>> 왜안되냐구.....

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.OK);

    expect(mockResponse.json).toHaveBeenCalledWith({
      status: HTTP_STATUS.OK,
      message: MESSAGES.AUTH.READ.SUCCEED,
      data: { userInfo: sampleUserInfo },
    });
  });
});
