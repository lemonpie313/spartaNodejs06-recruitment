import express from 'express';
import dotEnv from 'dotenv';
import { prisma } from '../utils/prisma.util.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import requireRoles from '../middlewares/role.middleware.js';
//import { Prisma } from '@prisma/client';

dotEnv.config();
const router = express.Router();

router.get('/recruiter/resume', authMiddleware, requireRoles(['RECRUITER']), async (req, res, next) => {
  try {
    console.log('관리자 모드');

    return res.status(200).json({
      status: 200,
      message: '관리자 모드.',
    });
  } catch (err) {
    next(err);
  }
});

export default router;
