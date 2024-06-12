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

router.patch('/recruiter/:id', accessTokenMiddleware, requireRoles(['RECRUITER']), recruiterEditValidator, async (req, res, next) => {
  try {
    const { userId } = req.user;
    const resumeId = req.params.id;
    const { status, reason } = req.body;

    const findResume = await prisma.Resume.findFirst({
      where: {
        resumeId: +resumeId,
      },
      select: {
        status: true,
      },
    });

    if (!findResume) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: HTTP_STATUS.NOT_FOUND,
        message: MESSAGES.RECRUITER.UPDATE.FAILED,
      });
    }

    const [resumeLog] = await prisma.$transaction(
      async (tx) => {
        await tx.Resume.update({
          data: {
            status,
          },
          where: {
            resumeId: +resumeId,
          },
        });

        const resumeLog = await tx.ResumeLog.create({
          data: {
            recruiterId: userId,
            resumeId: +resumeId,
            status,
            previousStatus: findResume.status,
            reason,
          },
          select: {
            resumeLogId: true,
            recruiterId: true,
            resumeId: true,
            previousStatus: true,
            status: true,
            reason: true,
            createdAt: true,
          },
        });

        return [resumeLog];
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      },
    );

    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RECRUITER.UPDATE.SUCCEED,
      data: resumeLog,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/recruiter/:id', accessTokenMiddleware, requireRoles(['RECRUITER']), async (req, res, next) => {
  try {
    const resumeId = req.params.id;

    const resume = await prisma.Resume.findFirst({
      where: {
        resumeId: +resumeId,
      },
    });

    if (!resume) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: HTTP_STATUS.NOT_FOUND,
        message: MESSAGES.RECRUITER.LOG.FAILED,
      });
    }

    const resumeLog = await prisma.ResumeLog.findMany({
      where: {
        resumeId: +resumeId,
      },
      select: {
        resumeLogId: true,
        users: {
          select: {
            userInfos: {
              select: {
                name: true,
              },
            },
          },
        },
        resumeId: true,
        previousStatus: true,
        status: true,
        reason: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RECRUITER.LOG.SUCCEED,
      data: { resumeLog },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
