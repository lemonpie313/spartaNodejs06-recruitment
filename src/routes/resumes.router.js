import express from 'express';
import { prisma } from '../utils/prisma.util.js';
import accessTokenMiddleware from '../middlewares/access-token.middleware.js';
import requireRoles from '../middlewares/role.middleware.js';
import { MESSAGES } from '../const/messages.const.js';
import { HTTP_STATUS } from '../const/http-status.const.js';
import { createResumeValidator, editResumeValidator } from '../middlewares/joi/resume.joi.middleware.js';

const router = express.Router();

router.post('/resume', accessTokenMiddleware, requireRoles(['APPLICANT']), createResumeValidator, async (req, res, next) => {
  try {
    const { userId } = req.user;

    const { title, content } = req.body;

    if (!title) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: HTTP_STATUS.BAD_REQUEST, message: MESSAGES.RES.CREATE.TITLE_REQUIRED });
    } else if (!content) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: HTTP_STATUS.BAD_REQUEST, message: MESSAGES.RES.CREATE.TITLE_REQUIRED });
    } else if (content.length < 150) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: HTTP_STATUS.BAD_REQUEST,
        message: MESSAGES.RES.CREATE.CONTENT_MIN_LENGTH,
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

    return res.status(HTTP_STATUS.CREATED).json({
      status: HTTP_STATUS.CREATED,
      message: MESSAGES.RES.CREATE.SUCCEED,
      data: { myResume },
    });
  } catch (err) {
    next(err);
  }
});

router.get('/resume', accessTokenMiddleware, async (req, res, next) => {
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

    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RES.READ.SUCCEED,
      data: { myPage },
    });
  } catch (err) {
    next(err);
  }
});

router.get('/resume/:id', accessTokenMiddleware, async (req, res, next) => {
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
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        status: HTTP_STATUS.FORBIDDEN,
        message: MESSAGES.RES.COMMON.FAILED,
      });
    }

    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RES.READ_ONE.SUCCEED,
      data: { myResume },
    });
  } catch (err) {
    next(err);
  }
});

router.patch('/resume/:id', accessTokenMiddleware, requireRoles(['APPLICANT']), editResumeValidator, async (req, res, next) => {
  try {
    const { userId } = req.user;
    const resumeId = req.params.id;
    const { title, content } = req.body;
    console.log('타이틀');
    const findResume = await prisma.Resume.findFirst({
      where: {
        userId,
        resumeId: +resumeId,
      },
    });

    if (!findResume) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        status: HTTP_STATUS.FORBIDDEN,
        message: MESSAGES.RES.COMMON.FAILED,
      });
    }

    const myResume = await prisma.Resume.update({
      data: {
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

    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RES.UPDATE.SUCCEED,
      data: { myResume },
    });
  } catch (err) {
    next(err);
  }
});

router.delete('/resume/:id', accessTokenMiddleware, requireRoles(['APPLICANT']), async (req, res, next) => {
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
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        status: HTTP_STATUS.FORBIDDEN,
        message: MESSAGES.RES.COMMON.FAILED,
      });
    }

    await prisma.Resume.delete({
      where: {
        userId,
        resumeId: +resumeId,
      },
    });
    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RES.DELETE.SUCCEED,
      data: { userId: userId },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
