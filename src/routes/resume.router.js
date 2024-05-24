import express from 'express';
import dotEnv from 'dotenv';
import { prisma } from '../utils/prisma.util.js';
import authMiddleware from '../middlewares/auth.middleware.js';
//import { Prisma } from '@prisma/client';

dotEnv.config();
const router = express.Router();

router.post('/resume', authMiddleware, async (req, res, next) => {
  const { userId } = req.user;

  const { title, content } = req.body;

  if (!title) {
    return res
      .status(400)
      .json({ status: 400, message: '제목을 입력해주세요.' });
  } else if (!content) {
    return res
      .status(400)
      .json({ status: 400, message: '내용을 입력해주세요.' });
  } else if (content.length < 150) {
    return res.status(400).json({
      status: 400,
      message: '이력서 내용은 150자 이상 작성해야 합니다.',
    });
  }

  const myResume = await prisma.myResumes.create({
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
});

router.get('/resume', authMiddleware, async (req, res, next) => {
  const { userId } = req.user;

  const myPage = await prisma.Users.findMany({
    where: {
      userId,
    },
    select: {
      userId: true,

      userInfos: {
        select: {
          name: true,
        },
      },
      myResumes: {
        select: {
          resumeId: true,
          title: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },

    orderBy: {
      createdAt: 'desc', // 게시글을 최신순으로 정렬합니다.
    },
  });

  return res.status(201).json({
    status: 201,
    message: '이력서 조회에 성공했습니다.',
    data: { myPage },
  });
});

export default router;
