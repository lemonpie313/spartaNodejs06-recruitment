import { prisma } from '../utils/prisma.util.js';

export class AuthRepository {
  //id로 유저 찾기
  findUserInfoById = async (userId) => {
    const userInfo = await prisma.Users.findFirst({
      where: {
        userId,
      },
    });
    return userInfo;
  };

  //이메일로 유저 찾기
  findUserInfoByEmail = async (email) => {
    const userInfo = await prisma.Users.findFirst({
      where: {
        email,
      },
    });
    return userInfo;
  };

  //유저 정보 생성
  createUserInfo = async (email, hashedPassword, name) => {
    const userInfo = await prisma.Users.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });
    return userInfo;
  };

  //토큰 생성
  upsertToken = async (userId, refreshTokenHashed) => {
    await prisma.RefreshToken.upsert({
      where: {
        userId,
      },
      update: {
        token: refreshTokenHashed,
      },
      create: {
        userId,
        token: refreshTokenHashed,
      },
    });
  };

  //토큰 조회
  findTokenById = async (userId) => {
    const tokenUser = await prisma.refreshToken.findFirst({
      where: { userId: +userId },
    });
    return tokenUser;
  };

  //토큰 삭제
  deleteToken = async (userId) => {
    const logOutUser = await prisma.RefreshToken.delete({
      where: {
        userId,
      },
    });
    return logOutUser;
  };
}
