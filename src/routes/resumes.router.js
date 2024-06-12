import express from 'express';
import { prisma } from '../utils/prisma.util.js';
import accessTokenMiddleware from '../middlewares/access-token.middleware.js';
import requireRoles from '../middlewares/role.middleware.js';
import { MESSAGES } from '../const/messages.const.js';
import { HTTP_STATUS } from '../const/http-status.const.js';
import { createResumeValidator, editResumeValidator } from '../middlewares/joi/resume.joi.middleware.js';
import { Prisma } from '@prisma/client';
import { recruiterEditValidator } from '../middlewares/joi/recruiter.joi.middleware.js';
import { ResumeController } from '../controllers/resume.controller.js';

const resumeController = new ResumeController();
const router = express.Router();

//이력서 작성
router.post('/', accessTokenMiddleware, requireRoles(['APPLICANT']), createResumeValidator, resumeController.createResume);

//이력서 조회
router.get('/', accessTokenMiddleware, resumeController.getAllResumes);

//이력서 상세 조회
router.get('/:id', accessTokenMiddleware, resumeController.getResume);

//이력서 수정
router.patch('/:id', accessTokenMiddleware, requireRoles(['APPLICANT']), editResumeValidator, resumeController.updateResume);

//이력서 삭제
router.delete('/:id', accessTokenMiddleware, requireRoles(['APPLICANT']), resumeController.deleteResume);

//채용관리자 이력서 상태 수정
router.patch('/recruiter/:id', accessTokenMiddleware, requireRoles(['RECRUITER']), recruiterEditValidator, resumeController.updateResumeStatus);

//채용관리자 이력서 로그 조회
router.get('/recruiter/:id', accessTokenMiddleware, requireRoles(['RECRUITER']), resumeController.getResumeLog);

export default router;
