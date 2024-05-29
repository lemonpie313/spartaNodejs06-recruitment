import express from 'express';
import dotEnv from 'dotenv';
import { prisma } from '../utils/prisma.util.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import requireRoles from '../middlewares/role.middleware.js';
import { resumeValidator } from '../middlewares/joi/resume.joi.middleware.js';
//import { Prisma } from '@prisma/client';

dotEnv.config();
const router = express.Router();

router.post('/resume', authMiddleware, requireRoles(['APPLICANT']), resumeValidator, async (req, res, next) => {
  try {
    const { userId } = req.user;

    const { title, content } = req.body;

    if (!title) {
      return res.status(400).json({ status: 400, message: '제목을 입력해주세요.' });
    } else if (!content) {
      return res.status(400).json({ status: 400, message: '내용을 입력해주세요.' });
    } else if (content.length < 150) {
      return res.status(400).json({
        status: 400,
        message: '이력서 내용은 150자 이상 작성해야 합니다.',
      });
    }

    const myResume = await prisma.Resume.create({
      data: {
        userId,
        title,
        content,
      },
      select: {
        resumeId: true,
        title: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(201).json({
      status: 201,
      message: '이력서 등록이 완료되었습니다.',
      data: { myResume },
    });
  } catch (err) {
    next(err);
  }
});

router.get('/resume', authMiddleware, async (req, res, next) => {
  try {
    const { userId, role } = req.user;

    const { sort, status } = req.query;

    const myPage = await prisma.Resume.findMany({
      where: {
        userId:
          role == 'APPLICANT'
            ? userId
            : {
                gt: 0,
              },
        status,
      },
      select: {
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
        title: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: sort ?? 'desc',
      },
    });

    return res.status(200).json({
      status: 200,
      message: '이력서 조회에 성공했습니다.',
      data: { myPage },
    });
  } catch (err) {
    next(err);
  }
});

router.get('/resume/:id', authMiddleware, async (req, res, next) => {
  try {
    const { userId, role } = req.user;
    const resumeId = req.params.id;

    const myResume = await prisma.Resume.findFirst({
      where: {
        resumeId: +resumeId,
        userId:
          role == 'APPLICANT'
            ? userId
            : {
                gt: 0,
              },
      },
      select: {
        users: {
          select: {
            userInfos: {
              select: {
                name: true,
              },
            },
          },
        },
        title: true,
        content: true,
      },
    });

    if (!myResume) {
      return res.status(404).json({
        status: 404,
        message: '이력서가 존재하지 않습니다.',
      });
    }

    return res.status(200).json({
      status: 200,
      message: '이력서 상세조회에 성공했습니다.',
      data: { myResume },
    });
  } catch (err) {
    next(err);
  }
});

router.patch('/resume/:id', authMiddleware, requireRoles(['APPLICANT']), async (req, res, next) => {
  try {
    const { userId } = req.user;
    const resumeId = req.params.id;
    const { title, content } = req.body;

    if ((!title && !content) || title == '') {
      return res.status(400).json({ status: 400, message: '수정할 내용을 입력해주세요.' });
    } else if (content == '' || content.length < 150) {
      return res.status(400).json({
        status: 400,
        message: '이력서 내용은 150자 이상 작성해야 합니다.',
      });
    }

    const findResume = await prisma.Resume.findFirst({
      where: {
        userId,
        resumeId: +resumeId,
      },
    });

    if (!findResume) {
      return res.status(404).json({
        status: 404,
        message: '이력서가 존재하지 않습니다.',
      });
    }

    const myResume = await prisma.Resume.update({
      data: {
        //...editResume,
        title,
        content,
      },
      where: {
        userId,
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
      message: '이력서 수정이 완료되었습니다.',
      data: { myResume },
    });
  } catch (err) {
    next(err);
  }
});

router.delete('/resume/:id', authMiddleware, requireRoles(['APPLICANT']), async (req, res, next) => {
  try {
    const { userId } = req.user;
    const resumeId = req.params.id;

    const findResume = await prisma.Resume.findFirst({
      where: {
        userId,
        resumeId: +resumeId,
      },
    });

    if (!findResume) {
      return res.status(404).json({
        status: 404,
        message: '이력서가 존재하지 않습니다.',
      });
    }

    await prisma.Resume.delete({
      where: {
        userId,
        resumeId: +resumeId,
      },
    });
    return res.status(200).json({
      status: 200,
      message: '이력서 삭제가 완료되었습니다.',
      data: { userId: userId },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
