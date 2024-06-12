export class UserService {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  // 회원정보 조회
  findUserInfo = async (userId) => {
    const userInfo = await this.authRepository.findUserInfoById(userId);
    return {
      userId: userInfo.userId,
      email: userInfo.email,
      name: userInfo.name,
      role: userInfo.role,
      createdAt: userInfo.createdAt,
      updatedAt: userInfo.updatedAt,
    };
  };
}
