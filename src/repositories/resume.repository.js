import { prisma } from '../utils/prisma.util.js';

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
}
