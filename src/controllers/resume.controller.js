import { ResumeService } from '../services/resume.service.js';
import { MESSAGES } from '../const/messages.const.js';
import { HTTP_STATUS } from '../const/http-status.const.js';

export class ResumeController {
  resumeService = new ResumeService();

  //이력서 생성
  createResume = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { title, content } = req.body;

      const resume = await this.resumeService.createResume(userId, title, content);

      return res.status(HTTP_STATUS.CREATED).json({
        status: HTTP_STATUS.CREATED,
        message: MESSAGES.RES.CREATE.SUCCEED,
        data: { resume },
      });
    } catch (err) {
      next(err);
    }
  };

  //이력서 목록 조회
  getAllResumes = async (req, res, next) => {
    try {
      const { userId, role } = req.user;
      const { sort, status } = req.query;

      const resumes = await this.resumeService.getAllResumes(userId, role, sort, status);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RES.READ.SUCCEED,
        data: { resumes },
      });
    } catch (err) {
      next(err);
    }
  };

  //이력서 상세 조회
  getResume = async (req, res, next) => {
    try {
      const { userId, role } = req.user;
      const resumeId = req.params.id;

      const resume = await this.resumeService.getResume(userId, role, +resumeId);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RES.READ_ONE.SUCCEED,
        data: { resume },
      });
    } catch (err) {
      next(err);
    }
  };

  //이력서 수정
  updateResume = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const resumeId = req.params.id;
      const { title, content } = req.body;

      const resume = await this.resumeService.updateResume(userId, +resumeId, title, content);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RES.UPDATE.SUCCEED,
        data: { resume },
      });
    } catch (err) {
      next(err);
    }
  };

  //이력서 삭제
  deleteResume = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const resumeId = req.params.id;

      await this.resumeService.deleteResume(userId, +resumeId);

      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.RES.DELETE.SUCCEED,
        data: { userId },
      });
    } catch (err) {
      next(err);
    }
  };

  //채용관리자 이력서 상태 수정
  updateResumeStatus = async (req, res, next) => {
    const { userId } = req.user;
    const resumeId = req.params.id;
    const { status, reason } = req.body;

    const resumeLog = await this.resumeService.updateResumeStatus(userId, +resumeId, status, reason);

    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RECRUITER.UPDATE.SUCCEED,
      data: resumeLog,
    });
  };

  //채용관리자 이력서 로그 조회
  getResumeLog = async (req, res, next) => {
    const resumeId = req.params.id;

    const resumeLog = await this.resumeService.getResumeLog(+resumeId);

    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RECRUITER.LOG.SUCCEED,
      data: { resumeLog },
    });
  };
}
