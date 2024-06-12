import { beforeEach, describe, jest, test, expect } from '@jest/globals';
import { AuthRepository } from '../../../src/repositories/auth.repository.js';
import { dummyUsers } from '../../dummies/users.dummy.js';

const mockPrisma = {
  users: {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
  },
  refreshTokens: {
    upsert: jest.fn(),
    findFirst: jest.fn(),
    delete: jest.fn(),
  },
};

const authRepository = new AuthRepository(mockPrisma);

describe('AuthRepository Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다
  });

  test('createUserInfo', async () => {
    const mockReturn = 'createUserInfoString';
    mockPrisma.users.create.mockReturnValue(mockReturn);

    const createUserParams = dummyUsers[0];
    const createUserData = await authRepository.createUserInfo(createUserParams.email, createUserParams.password, createUserParams.name);

    expect(createUserData).toBe(mockReturn);
    expect(mockPrisma.users.create).toHaveBeenCalledTimes(1);
    expect(mockPrisma.users.create).toHaveBeenCalledWith({
      data: createUserParams,
    });
  });

  test('findUserInfoById', async () => {
    const mockReturn = 'findUserInfoByIdString';
    mockPrisma.users.findFirst.mockReturnValue(mockReturn);

    const findUserParams = 1;
    const userInfo = await authRepository.findUserInfoById(findUserParams);

    expect(userInfo).toBe(mockReturn);
    expect(mockPrisma.users.findFirst).toHaveBeenCalledTimes(1);
    expect(mockPrisma.users.findFirst).toHaveBeenCalledWith({ where: { userId: findUserParams } });
  });

  test('findUserInfoByEmail', async () => {
    const mockReturn = 'findUserInfoByEmailString';
    mockPrisma.users.findFirst.mockReturnValue(mockReturn);

    const findUserParams = 'spartan@spartacodingclub.kr';
    const userInfo = await authRepository.findUserInfoByEmail(findUserParams);

    expect(userInfo).toBe(mockReturn);
    expect(mockPrisma.users.findFirst).toHaveBeenCalledTimes(1);
    expect(mockPrisma.users.findFirst).toHaveBeenCalledWith({ where: { email: findUserParams } });
  });

  test('upsertToken', async () => {
    const mockReturn = 'upsertTokenString';
    mockPrisma.refreshTokens.upsert.mockReturnValue(mockReturn);

    const upsertTokenParams = {
      userId: 1,
      refreshTokenHashed: 'refreshTokenTest',
    };
    const token = await authRepository.upsertToken(upsertTokenParams.userId, upsertTokenParams.refreshTokenHashed);

    expect(token).toBe(mockReturn);
    expect(mockPrisma.refreshTokens.upsert).toHaveBeenCalledTimes(1);
    expect(mockPrisma.refreshTokens.upsert).toHaveBeenCalledWith({
      create: {
        token: upsertTokenParams.refreshTokenHashed,
        userId: upsertTokenParams.userId,
      },
      update: {
        token: upsertTokenParams.refreshTokenHashed,
      },
      where: {
        userId: upsertTokenParams.userId,
      },
    });
  });

  test('findTokenById', async () => {
    const mockReturn = 'findTokenById';
    mockPrisma.refreshTokens.findFirst.mockReturnValue(mockReturn);

    const findTokenParams = 1;
    const tokenUser = await authRepository.findTokenById(findTokenParams);

    expect(tokenUser).toBe(mockReturn);
    expect(mockPrisma.refreshTokens.findFirst).toHaveBeenCalledTimes(1);
    expect(mockPrisma.refreshTokens.findFirst).toHaveBeenCalledWith({ where: { userId: findTokenParams } });
  });
});
