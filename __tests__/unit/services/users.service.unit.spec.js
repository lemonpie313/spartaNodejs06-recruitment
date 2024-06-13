import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { UserService } from '../../../src/services/user.service';
import { dummyUsers } from '../../dummies/users.dummy.js';

const mockAuthRepository = {
  findUserInfoById: jest.fn(),
};

const userService = new UserService(mockAuthRepository);

describe('UserService Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
  });

  test('findUserInfo', async () => {
    const mockReturn = dummyUsers[1];
    mockAuthRepository.findUserInfoById.mockReturnValue(mockReturn);

    const findUserParams = dummyUsers[1].userId;
    const userInfo = await userService.findUserInfo(findUserParams);

    expect(userInfo).toEqual({
      userId: mockReturn.userId,
      email: mockReturn.email,
      name: mockReturn.name,
      role: mockReturn.role,
      createdAt: mockReturn.createdAt,
      updatedAt: mockReturn.updatedAt,
    });
    expect(mockAuthRepository.findUserInfoById).toHaveBeenCalledTimes(1);
    expect(mockAuthRepository.findUserInfoById).toHaveBeenCalledWith(findUserParams);
  });
});
