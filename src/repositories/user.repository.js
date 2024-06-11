import { prisma } from '../utils/prisma.util.js';

export class UserRepository {
  findUserInfo = async (userId) => {
    const userInfo = await prisma.UserInfos.findFirst({
      where: {
        userId: userId,
      },
      select: {
        userId: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return userInfo;
  };
}
