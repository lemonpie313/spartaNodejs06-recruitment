import { UserRepository } from '../repositories/user.repository.js';

export class UserService {
  userRepository = new UserRepository();

  // 게시글 조회
  findUserInfo = async (userId) => {
    const userInfo = await this.userRepository.findUserInfo(userId);
    return userInfo;
  };
}
