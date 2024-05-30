import express from 'express';
import { prisma } from '../utils/prisma.util.js';
import authMiddleware from '../middlewares/access-token.middleware.js';
import requireRoles from '../middlewares/role.middleware.js';
import { Prisma } from '@prisma/client';
import { recruiterEditValidator } from '../middlewares/joi/recruiter.joi.middleware.js';

const router = express.Router();

router.patch('/resume/recruiter/:id', authMiddleware, requireRoles(['RECRUITER']), recruiterEditValidator, async (req, res, next) => {
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
      return res.status(404).json({
        status: 404,
        message: '이력서가 존재하지 않습니다.',
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

    return res.status(200).json({
      status: 200,
      message: '이력서 상태 수정이 완료되었습니다.',
      data: resumeLog,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/resume/recruiter/:id', authMiddleware, requireRoles(['RECRUITER']), async (req, res, next) => {
  try {
    const resumeId = req.params.id;

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

    return res.status(200).json({
      status: 200,
      message: '이력서 로그 조회에 성공했습니다.',
      data: { resumeLog },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
