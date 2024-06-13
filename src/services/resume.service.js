import { ROLE } from '../const/role.const.js';
import { SORT } from '../const/sort.const.js';
import { MESSAGES } from '../const/messages.const.js';
import { HttpError } from '../error/http.error.js';

export class ResumeService {
  constructor(resumeRepository) {
    this.resumeRepository = resumeRepository;
  }

  //이력서 생성
  createResume = async (userId, title, content) => {
    const resume = await this.resumeRepository.createResume(userId, title, content);
    return {
      resumeId: resume.resumeId,
      title: resume.title,
      status: resume.status,
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt,
    };
  };

  //이력서 목록 조회
  getAllResumes = async (userId, role, sort, status) => {
    if (sort != SORT.ASC && sort != SORT.DESC) {
      throw new HttpError.BadRequest(MESSAGES.RES.READ.SORT.INVALID_FORMAT);
    }
    let resumes;
    if (role == ROLE.RECRUITER) {
      resumes = await this.resumeRepository.getAllResumes();
    } else {
      resumes = await this.resumeRepository.getAllResumesById(userId);
    }
    if (status) {
      resumes = resumes.filter((cur) => cur.status == status);
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
      throw new HttpError.NotFound(MESSAGES.RES.COMMON.FAILED);
    }
    return resume;
  };

  //이력서 수정
  updateResume = async (userId, resumeId, title, content) => {
    const findResume = await this.resumeRepository.getResumeByUserId(userId, resumeId);
    if (!findResume) {
      throw new HttpError.NotFound(MESSAGES.RES.COMMON.FAILED);
    }
    const resume = await this.resumeRepository.updateResume(userId, resumeId, title, content);
    return resume;
  };

  //이력서 삭제
  deleteResume = async (userId, resumeId) => {
    const findResume = await this.resumeRepository.getResumeByUserId(userId, resumeId);
    if (!findResume) {
      throw new HttpError.NotFound(MESSAGES.RES.COMMON.FAILED);
    }
    await this.resumeRepository.deleteResume(userId, resumeId);
  };

  //채용관리자 이력서 상태 수정
  updateResumeStatus = async (userId, resumeId, status, reason) => {
    const findResume = await this.resumeRepository.getResumeById(resumeId);
    if (!findResume) {
      throw new HttpError.NotFound(MESSAGES.RES.COMMON.FAILED);
    }
    const resumeLog = await this.resumeRepository.updateResumeStatus(userId, resumeId, status, reason, findResume.status);
    return resumeLog;
  };

  //채용관리자 이력서 로그 조회
  getResumeLog = async (resumeId) => {
    const findResume = await this.resumeRepository.getResumeById(resumeId);
    if (!findResume) {
      throw new HttpError.NotFound(MESSAGES.RES.COMMON.FAILED);
    }
    const resumeLog = await this.resumeRepository.getResumeLogById(resumeId);
    return resumeLog.sort((a, b) => b.createdAt - a.createdAt);
  };
}
