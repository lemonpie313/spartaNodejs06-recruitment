import { beforeEach, describe, jest, test, expect } from '@jest/globals';
import { dummyResumes } from '../../dummies/resumes.dummy.js';
import { ResumeRepository } from '../../../src/repositories/resume.repository.js';
import { Prisma } from '@prisma/client';

const mockPrisma = {
  resumes: {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  resumeLog: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
  $transaction: jest.fn(),
};

const resumeRepository = new ResumeRepository(mockPrisma, Prisma);

describe('Resume Repository Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  //이력서 생성
  test('createResume', async () => {
    const mockReturn = dummyResumes.create.return;
    mockPrisma.resumes.create.mockReturnValue(mockReturn);

    const params = Object.values(dummyResumes.create.params);
    const data = await resumeRepository.createResume(...params);

    expect(data).toBe(mockReturn);
    expect(mockPrisma.resumes.create).toHaveBeenCalledTimes(1);
    expect(mockPrisma.resumes.create).toHaveBeenCalledWith({ data: dummyResumes.create.params });
  });

  //채용관리자 이력서 조회
  test('getAllResumes', async () => {
    const mockReturn = dummyResumes.findMany;
    mockPrisma.resumes.findMany.mockReturnValue(mockReturn);

    const data = await resumeRepository.getAllResumes();

    expect(data).toBe(mockReturn);
    expect(mockPrisma.resumes.findMany).toHaveBeenCalledTimes(1);
    expect(mockPrisma.resumes.findMany).toHaveBeenCalledWith({
      select: {
        users: {
          select: {
            name: true,
          },
        },
        resumeId: true,
        title: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  });

  //지원자 이력서 조회
  test('getAllResumesById', async () => {
    const mockReturn = dummyResumes.findMany.slice(0, 2);
    mockPrisma.resumes.findMany.mockReturnValue(mockReturn);

    const params = 1;
    const data = await resumeRepository.getAllResumesById(params);

    expect(data).toBe(mockReturn);
    expect(mockPrisma.resumes.findMany).toHaveBeenCalledTimes(1);
    expect(mockPrisma.resumes.findMany).toHaveBeenCalledWith({
      where: {
        userId: params,
      },
      select: {
        users: {
          select: {
            name: true,
          },
        },
        resumeId: true,
        title: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  });

  //채용관리자 이력서 상세조회
  test('getResumeById', async () => {
    const mockReturn = dummyResumes.findFirst.return;
    mockPrisma.resumes.findFirst.mockReturnValue(mockReturn);

    const params = dummyResumes.findFirst.params.resumeId;
    const data = await resumeRepository.getResumeById(params);

    expect(data).toBe(mockReturn);
    expect(mockPrisma.resumes.findFirst).toHaveBeenCalledTimes(1);
    expect(mockPrisma.resumes.findFirst).toHaveBeenCalledWith({
      where: {
        resumeId: params,
      },
      select: {
        users: {
          select: {
            name: true,
          },
        },
        resumeId: true,
        title: true,
        content: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  });

  //지원자 이력서 상세조회
  test('getResumeByUserId', async () => {
    const mockReturn = dummyResumes.findFirst.return;
    mockPrisma.resumes.findFirst.mockReturnValue(mockReturn);

    const params = dummyResumes.findFirst.params;
    const data = await resumeRepository.getResumeByUserId(params.userId, params.resumeId);

    expect(data).toBe(mockReturn);
    expect(mockPrisma.resumes.findFirst).toHaveBeenCalledTimes(1);
    expect(mockPrisma.resumes.findFirst).toHaveBeenCalledWith({
      where: {
        userId: params.userId,
        resumeId: params.resumeId,
      },
      select: {
        users: {
          select: {
            name: true,
          },
        },
        resumeId: true,
        title: true,
        content: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  });

  //이력서 수정
  test('updateResume', async () => {
    const mockReturn = dummyResumes.update.return;
    mockPrisma.resumes.update.mockReturnValue(mockReturn);

    const params = dummyResumes.update.params;
    const data = await resumeRepository.updateResume(params.userId, params.resumeId, params.title, params.content);

    expect(data).toBe(mockReturn);
    expect(mockPrisma.resumes.update).toHaveBeenCalledTimes(1);
    expect(mockPrisma.resumes.update).toHaveBeenCalledWith({
      data: {
        title: params.title,
        content: params.content,
      },
      where: {
        userId: params.userId,
        resumeId: params.resumeId,
      },
    });
  });

  //이력서 삭제
  test('deleteResume', async () => {
    const params = dummyResumes.delete.params;
    await resumeRepository.deleteResume(params.userId, params.resumeId);

    expect(mockPrisma.resumes.delete).toHaveBeenCalledTimes(1);
    expect(mockPrisma.resumes.delete).toHaveBeenCalledWith({
      where: {
        userId: params.userId,
        resumeId: params.resumeId,
      },
    });
  });

  //이력서 상태 수정
  test('updateResumeStatus', async () => {
    const mockReturn = dummyResumes.statusUpdate.return;
    mockPrisma.$transaction.mockReturnValue(mockReturn);

    const params = [
      dummyResumes.statusUpdate.params.userId,
      dummyResumes.statusUpdate.params.resumeId,
      dummyResumes.statusUpdate.params.status,
      dummyResumes.statusUpdate.params.reason,
      dummyResumes.statusUpdate.params.previousStatus,
    ];
    const data = await resumeRepository.updateResumeStatus(...params);

    expect(data).toBe(mockReturn);
    expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
  });

  //이력서 로그 조회
  test('getResumeLogById', async () => {
    const mockReturn = dummyResumes.getResumeLog.return;
    mockPrisma.resumeLog.findMany.mockReturnValue(mockReturn);

    const params = dummyResumes.getResumeLog.params.resumeId;
    const data = await resumeRepository.getResumeLogById(params);

    expect(data).toBe(mockReturn);
    expect(mockPrisma.resumeLog.findMany).toHaveBeenCalledTimes(1);
    expect(mockPrisma.resumeLog.findMany).toHaveBeenCalledWith({
      where: {
        resumeId: params,
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
  });
});
