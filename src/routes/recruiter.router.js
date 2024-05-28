import express from 'express';
import dotEnv from 'dotenv';
import { prisma } from '../utils/prisma.util.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import requireRoles from '../middlewares/role.middleware.js';
//import { Prisma } from '@prisma/client';

dotEnv.config();
const router = express.Router();

router.patch('/resume/recruiter/:id', authMiddleware, requireRoles(['RECRUITER']), async (req, res, next) => {
  try {
    const { userId } = req.user;
    const resumeId = req.params.id;
    const { status, reason } = req.body;

    const statusList = ['APPLY', 'DROP', 'INTERVIEW1', 'INTERVIEW2', 'FINAL_PASS'];

    if (!status) {
      return res.status(400).json({ status: 400, message: '변경하고자 하는 상태를 확인해주세요.' });
    } else if (!statusList.includes(status)) {
      return res.status(400).json({ status: 400, message: '유효하지 않은 지원상태입니다.' });
    } else if (!reason) {
      return res.status(400).json({ status: 400, message: '지원 상태 변경 사유를 입력해주세요.' });
    }

    const findResume = await prisma.Resume.findFirst({
      where: {
        resumeId: +resumeId,
      },
    });

    if (!findResume) {
      return res.status(404).json({
        status: 404,
        message: '이력서가 존재하지 않습니다.',
      });
    }

    const resume = await prisma.Resume.update({
      data: {
        status,
      },
      where: {
        resumeId: +resumeId,
      },
      select: {
        resumeId: true,
        userId: true,
        title: true,
        content: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({
      status: 200,
      message: '관리자 모드.',
      data: resume,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
