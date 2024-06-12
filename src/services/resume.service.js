import { ResumeRepository } from '../repositories/resume.repository.js';
import { ROLE } from '../const/role.const.js';
import { SORT } from '../const/sort.const.js';
import { MESSAGES } from '../const/messages.const.js';

export class ResumeService {
  resumeRepository = new ResumeRepository();

  //이력서 생성
  createResume = async (userId, title, content) => {
    const resume = await this.resumeRepository.createResume(userId, title, content);
    return resume;
  };

  //이력서 목록 조회
  getAllResumes = async (userId, role, sort, status) => {
    if (sort != SORT.ASC && sort != SORT.DESC) {
      throw new Error(MESSAGES.RES.READ.SORT.INVALID_FORMAT);
    }
    let resumes;
    if (role == ROLE.RECRUITER) {
      resumes = await this.resumeRepository.getAllResumes(status);
    } else {
      resumes = await this.resumeRepository.getAllResumesById(userId, status);
    }
    return resumes.sort((a, b) => (sort == SORT.ASC ? a.createdAt - b.createdAt : b.createdAt - a.createdAt));
  };

  //이력서 상세 조회
  getResume = async (userId, role, resumeId) => {
    let resume;
    if (role == ROLE.RECRUITER) {
      resume = await this.resumeRepository.getResumeById(resumeId);
    } else {
      resume = await this.resumeRepository.getResumeByUserId(userId, resumeId);
    }
    if (!resume) {
      throw new Error(MESSAGES.RES.COMMON.FAILED);
    }
    return resume;
  };
}
