import { beforeEach, describe, jest, test, expect } from '@jest/globals';
import { dummyResumes } from '../../dummies/resumes.dummy.js';
import { ResumeRepository } from '../../../src/repositories/resume.repository.js';

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
};

const resumeRepository = new ResumeRepository(mockPrisma);

describe('Resume Repository Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('createResume', async () => {
    const mockReturn = dummyResumes.create.return;
    mockPrisma.resumes.create.mockReturnValue(mockReturn);

    const params = Object.values(dummyResumes.create.params);
    const data = await resumeRepository.createResume(...params);

    expect(data).toBe(mockReturn);
    expect(mockPrisma.resumes.create).toHaveBeenCalledTimes(1);
    expect(mockPrisma.resumes.create).toHaveBeenCalledWith({ data: dummyResumes.create.params });
  });

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

  test('updateResume', async () => {
    const mockReturn = dummyResumes.update.return;
    mockPrisma.resumes.update.mockReturnValue(mockReturn);

    const params = dummyResumes.update.params;
    const updateResumeData = await resumeRepository.updateResume(params.userId, params.resumeId, params.title, params.content);

    expect(updateResumeData).toBe(mockReturn);
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

  test('deleteResume', async () => {
    const deleteResumeParams = dummyResumes.delete.params;
    await resumeRepository.deleteResume(deleteResumeParams.userId, deleteResumeParams.resumeId);

    expect(mockPrisma.resumes.delete).toHaveBeenCalledTimes(1);
    expect(mockPrisma.resumes.delete).toHaveBeenCalledWith({
      where: {
        userId: deleteResumeParams.userId,
        resumeId: deleteResumeParams.resumeId,
      },
    });
  });
});
