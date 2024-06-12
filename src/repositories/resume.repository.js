import { prisma } from '../utils/prisma.util.js';
import { Prisma } from '@prisma/client';

export class ResumeRepository {
  //이력서 생성
  createResume = async (userId, title, content) => {
    const myResume = await prisma.Resumes.create({
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
    return myResume;
  };

  //모든 이력서 목록 조회
  getAllResumes = async (status) => {
    const resumes = await prisma.Resumes.findMany({
      where: {
        status,
      },
    });
    return resumes;
  };

  //아이디에 해당하는 이력서 목록 조회
  getAllResumesById = async (userId, status) => {
    const resumes = await prisma.Resumes.findMany({
      where: {
        userId,
        status,
      },
      select: {
        users: {
          select: {
            name: true,
          },
        },
        title: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return resumes;
  };

  //이력서 상세조회
  getResumeById = async (resumeId) => {
    const resume = await prisma.Resumes.findFirst({
      where: {
        resumeId,
      },
      select: {
        users: {
          select: {
            name: true,
          },
        },
        title: true,
        content: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return resume;
  };

  //내 이력서 상세조회
  getResumeByUserId = async (userId, resumeId) => {
    const resume = await prisma.Resumes.findFirst({
      where: {
        resumeId,
        userId,
      },
      select: {
        users: {
          select: {
            name: true,
          },
        },
        title: true,
        content: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return resume;
  };

  //이력서 수정
  updateResume = async (userId, resumeId, title, content) => {
    const resume = await prisma.Resumes.update({
      data: {
        title,
        content,
      },
      where: {
        userId,
        resumeId,
      },
    });
    return resume;
  };

  //이력서 삭제
  deleteResume = async (userId, resumeId) => {
    await prisma.Resumes.delete({
      where: {
        userId,
        resumeId,
      },
    });
  };

  //채용관리자 이력서 상태 수정
  updateResumeStatus = async (userId, resumeId, status, reason, previousStatus) => {
    const resumeLog = await prisma.$transaction(
      async (tx) => {
        await tx.Resumes.update({
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
            previousStatus,
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
    return resumeLog;
  };

  //채용관리자 이력서 로그 조회
  getResumeLogById = async (resumeId) => {
    const resumeLog = await prisma.ResumeLog.findMany({
      where: {
        resumeId,
      },
      select: {
        resumeLogId: true,
        users: {
          select: {
            name: true,
          },
        },
        resumeId: true,
        previousStatus: true,
        status: true,
        reason: true,
        createdAt: true,
      },
    });

    return resumeLog;
  };
}
