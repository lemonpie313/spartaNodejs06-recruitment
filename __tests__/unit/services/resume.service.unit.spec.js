import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { ResumeService } from '../../../src/services/resume.service.js';
import { dummyResumes } from '../../dummies/resumes.dummy.js';
import { MESSAGES } from '../../../src/const/messages.const.js';
import { HttpError } from '../../../src/error/http.error.js';

const mockResumeRepository = {
  createResume: jest.fn(),
  getAllResumes: jest.fn(),
  getAllResumesById: jest.fn(),
  getResumeById: jest.fn(),
  getResumeByUserId: jest.fn(),
  updateResume: jest.fn(),
  deleteResume: jest.fn(),
  updateResumeStatus: jest.fn(),
  getResumeLogById: jest.fn(),
};

const resumeService = new ResumeService(mockResumeRepository);

describe('Resume Service Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  //이력서 작성
  test('createResume', async () => {
    const mockReturn = dummyResumes.create.return;
    mockResumeRepository.createResume.mockReturnValue(mockReturn);

    const params = dummyResumes.create.params;
    const data = await resumeService.createResume(params.userId, params.title, params.content);

    expect(data).toEqual({
      resumeId: mockReturn.resumeId,
      title: mockReturn.title,
      status: mockReturn.status,
      createdAt: mockReturn.createdAt,
      updatedAt: mockReturn.updatedAt,
    });
    expect(mockResumeRepository.createResume).toHaveBeenCalledTimes(1);
    expect(mockResumeRepository.createResume).toHaveBeenCalledWith(params.userId, params.title, params.content);
  });

  //관리자 이력서 조회
  test('getAllResumes - Recruiter', async () => {
    const mockReturn = dummyResumes.findMany;
    mockResumeRepository.getAllResumes.mockReturnValue(mockReturn);

    const params = [1, 'RECRUITER', 'ASC', 'APPLY'];
    const data = await resumeService.getAllResumes(...params);

    expect(data).toEqual(
      mockReturn
        .filter((cur) => {
          if (params[3]) {
            return cur.status == params[3];
          }
          return true;
        })
        .sort((a, b) => (params[2] == 'ASC' ? a.createdAt - b.createdAt : b.createdAt - a.createdAt)),
    );
    expect(mockResumeRepository.getAllResumes).toHaveBeenCalledTimes(1);
    expect(mockResumeRepository.getAllResumes).toHaveBeenCalledWith();
  });

  //지원자 본인 이력서 조회
  test('getAllResumes - Applicant', async () => {
    const mockReturn = dummyResumes.findMany.slice(0, 2);
    mockResumeRepository.getAllResumesById.mockReturnValue(mockReturn);

    const params = [1, 'APPLICANT', 'DESC', 'APPLY'];
    const data = await resumeService.getAllResumes(...params);

    expect(data).toEqual(
      mockReturn
        .filter((cur) => {
          if (params[3]) {
            return cur.status == params[3];
          }
          return true;
        })
        .sort((a, b) => (params[2] == 'ASC' ? a.createdAt - b.createdAt : b.createdAt - a.createdAt)),
    );
    expect(mockResumeRepository.getAllResumesById).toHaveBeenCalledTimes(1);
    expect(mockResumeRepository.getAllResumesById).toHaveBeenCalledWith(params[0]);
  });

  //지원자 본인 이력서 조회 - 쿼리 적용 X
  test('getAllResumes - Applicant - invalid query', async () => {
    const mockReturn = dummyResumes.findMany.slice(0, 2);
    mockResumeRepository.getAllResumesById.mockReturnValue(mockReturn);

    const params = [1, 'APPLICANT'];
    const data = await resumeService.getAllResumes(...params);

    expect(data).toEqual(
      mockReturn
        .filter((cur) => {
          if (params[3]) {
            return cur.status == params[3];
          }
          return true;
        })
        .sort((a, b) => (params[2] == 'ASC' ? a.createdAt - b.createdAt : b.createdAt - a.createdAt)),
    );
    expect(mockResumeRepository.getAllResumesById).toHaveBeenCalledTimes(1);
    expect(mockResumeRepository.getAllResumesById).toHaveBeenCalledWith(params[0]);
  });

  //지원자 본인 이력서 조회 - SORT 값 잘못됨
  test('getAllResumes - Applicant - invalid query', async () => {
    const mockReturn = dummyResumes.findMany.slice(0, 2);
    mockResumeRepository.getAllResumesById.mockReturnValue(mockReturn);
    const params = [1, 'APPLICANT', 'WRONG_QUERY', 'APPLY'];
    try {
      const data = await resumeService.getAllResumes(...params);
    } catch (err) {
      expect(err).toEqual(new HttpError.BadRequest(MESSAGES.RES.READ.QUERY.INVALID_FORMAT));
    }
  });

  //지원자 본인 이력서 조회 - STATUS 값 잘못됨
  test('getAllResumes - Applicant', async () => {
    const mockReturn = dummyResumes.findMany.slice(0, 2);
    mockResumeRepository.getAllResumesById.mockReturnValue(mockReturn);
    const params = [1, 'APPLICANT', 'DESC', 'WRONG_QUERY'];
    try {
      const data = await resumeService.getAllResumes(...params);
    } catch (err) {
      expect(err).toEqual(new HttpError.BadRequest(MESSAGES.RES.READ.QUERY.INVALID_FORMAT));
    }
  });

  //관리자 이력서 상세조회
  test('getResume - Recruiter', async () => {
    const mockReturn = dummyResumes.findFirst.return;
    mockResumeRepository.getResumeById.mockReturnValue(mockReturn);

    const params = [dummyResumes.findFirst.params.userId, 'RECRUITER', dummyResumes.findFirst.params.resumeId];
    const data = await resumeService.getResume(...params);

    expect(data).toBe(mockReturn);
    expect(mockResumeRepository.getResumeById).toHaveBeenCalledTimes(1);
    expect(mockResumeRepository.getResumeById).toHaveBeenCalledWith(params[2]);
  });

  //관리자 이력서 상세조회 - 이력서 없을때
  test('getResume - Recruiter - not found', async () => {
    const mockReturn = undefined;
    mockResumeRepository.getResumeById.mockReturnValue(mockReturn);
    const params = [dummyResumes.findFirst.params.userId, 'RECRUITER', dummyResumes.findFirst.params.resumeId];
    try {
      const data = await resumeService.getResume(...params);
    } catch (err) {
      expect(mockResumeRepository.getResumeById).toHaveBeenCalledTimes(1);
      expect(mockResumeRepository.getResumeById).toHaveBeenCalledWith(params[2]);
      expect(err).toEqual(new HttpError.NotFound(MESSAGES.RES.COMMON.FAILED));
    }
  });

  //지원자 본인 이력서 상세조회
  test('getResume - Applicant', async () => {
    const mockReturn = dummyResumes.findFirst.return;
    mockResumeRepository.getResumeByUserId.mockReturnValue(mockReturn);

    const params = [dummyResumes.findFirst.params.userId, 'APPLICANT', dummyResumes.findFirst.params.resumeId];
    const data = await resumeService.getResume(...params);

    expect(data).toBe(mockReturn);
    expect(mockResumeRepository.getResumeByUserId).toHaveBeenCalledTimes(1);
    expect(mockResumeRepository.getResumeByUserId).toHaveBeenCalledWith(params[0], params[2]);
  });

  //지원자 본인 이력서 상세조회 - 이력서 없을때
  test('getResume - Applicant - not found', async () => {
    const mockReturn = undefined;
    mockResumeRepository.getResumeByUserId.mockReturnValue(mockReturn);
    const params = [dummyResumes.findFirst.params.userId, 'APPLICANT', dummyResumes.findFirst.params.resumeId];
    try {
      const data = await resumeService.getResume(...params);
    } catch (err) {
      expect(mockResumeRepository.getResumeByUserId).toHaveBeenCalledTimes(1);
      expect(mockResumeRepository.getResumeByUserId).toHaveBeenCalledWith(params[0], params[2]);
      expect(err).toEqual(new HttpError.NotFound(MESSAGES.RES.COMMON.FAILED));
    }
  });

  //이력서 수정
  test('updateResume', async () => {
    const findMockReturn = dummyResumes.update.findFirst;
    mockResumeRepository.getResumeByUserId.mockReturnValue(findMockReturn);

    const updateMockReturn = dummyResumes.create.return;
    mockResumeRepository.updateResume.mockReturnValue(updateMockReturn);

    const params = [
      dummyResumes.update.params.userId,
      dummyResumes.update.params.resumeId,
      dummyResumes.update.params.title,
      dummyResumes.update.params.content,
    ];
    const data = await resumeService.updateResume(...params);

    expect(data).toBe(updateMockReturn);
    expect(mockResumeRepository.getResumeByUserId).toHaveBeenCalledTimes(1);
    expect(mockResumeRepository.getResumeByUserId).toHaveBeenCalledWith(params[0], params[1]);
    expect(mockResumeRepository.updateResume).toHaveBeenCalledTimes(1);
    expect(mockResumeRepository.updateResume).toHaveBeenCalledWith(...params);
  });

  //이력서 수정 - 이력서 없을때
  test('updateResume - not found', async () => {
    const findMockReturn = undefined;
    mockResumeRepository.getResumeByUserId.mockReturnValue(findMockReturn);
    const params = [
      dummyResumes.update.params.userId,
      dummyResumes.update.params.resumeId,
      dummyResumes.update.params.title,
      dummyResumes.update.params.content,
    ];
    try {
      const data = await resumeService.updateResume(...params);
    } catch (err) {
      expect(mockResumeRepository.getResumeByUserId).toHaveBeenCalledTimes(1);
      expect(mockResumeRepository.getResumeByUserId).toHaveBeenCalledWith(params[0], params[1]);
      expect(err).toEqual(new HttpError.NotFound(MESSAGES.RES.COMMON.FAILED));
    }
  });

  //이력서 삭제
  test('deleteResume', async () => {
    const findMockReturn = dummyResumes.delete.findFirst;
    mockResumeRepository.getResumeByUserId.mockReturnValue(findMockReturn);

    const params = [dummyResumes.delete.params.userId, dummyResumes.delete.params.resumeId];
    await resumeService.deleteResume(...params);

    expect(mockResumeRepository.getResumeByUserId).toHaveBeenCalledTimes(1);
    expect(mockResumeRepository.getResumeByUserId).toHaveBeenCalledWith(params[0], params[1]);
    expect(mockResumeRepository.deleteResume).toHaveBeenCalledTimes(1);
    expect(mockResumeRepository.deleteResume).toHaveBeenCalledWith(...params);
  });

  //이력서 삭제 - 이력서 없을때
  test('deleteResume - not found', async () => {
    const findMockReturn = undefined;
    mockResumeRepository.getResumeByUserId.mockReturnValue(findMockReturn);
    const params = [dummyResumes.delete.params.userId, dummyResumes.delete.params.resumeId];
    try {
      await resumeService.deleteResume(...params);
    } catch (err) {
      expect(mockResumeRepository.getResumeByUserId).toHaveBeenCalledTimes(1);
      expect(mockResumeRepository.getResumeByUserId).toHaveBeenCalledWith(params[0], params[1]);
      expect(err).toEqual(new HttpError.NotFound(MESSAGES.RES.COMMON.FAILED));
    }
  });

  //이력서 상태 수정
  test('updateResumeStatus', async () => {
    const findMockReturn = dummyResumes.statusUpdate.findFirst;
    mockResumeRepository.getResumeById.mockReturnValue(findMockReturn);

    const updateMockReturn = dummyResumes.statusUpdate.return;
    mockResumeRepository.updateResumeStatus.mockReturnValue(updateMockReturn);

    const params = [
      dummyResumes.update.params.userId,
      dummyResumes.update.params.resumeId,
      dummyResumes.update.params.status,
      dummyResumes.update.params.reason,
    ];
    const data = await resumeService.updateResumeStatus(...params);

    expect(data).toBe(updateMockReturn);
    expect(mockResumeRepository.getResumeById).toHaveBeenCalledTimes(1);
    expect(mockResumeRepository.getResumeById).toHaveBeenCalledWith(params[1]);
    expect(mockResumeRepository.updateResumeStatus).toHaveBeenCalledTimes(1);
    expect(mockResumeRepository.updateResumeStatus).toHaveBeenCalledWith(...params, findMockReturn.status);
  });

  //이력서 상태 수정 - 이력서 존재 X
  test('updateResumeStatus - not found', async () => {
    const findMockReturn = undefined;
    mockResumeRepository.getResumeById.mockReturnValue(findMockReturn);
    const params = [
      dummyResumes.update.params.userId,
      dummyResumes.update.params.resumeId,
      dummyResumes.update.params.status,
      dummyResumes.update.params.reason,
    ];
    try {
      const data = await resumeService.updateResumeStatus(...params);
    } catch (err) {
      expect(mockResumeRepository.getResumeById).toHaveBeenCalledTimes(1);
      expect(mockResumeRepository.getResumeById).toHaveBeenCalledWith(params[1]);
      expect(err).toEqual(new HttpError.NotFound(MESSAGES.RES.COMMON.FAILED));
    }
  });

  //이력서 로그 조회
  test('getResumeLog', async () => {
    const findMockReturn = dummyResumes.getResumeLog.findFirst;
    mockResumeRepository.getResumeById.mockReturnValue(findMockReturn);

    const mockReturn = dummyResumes.getResumeLog.return;
    mockResumeRepository.getResumeLogById.mockReturnValue(mockReturn);

    const params = dummyResumes.getResumeLog.params.resumeId;
    const data = await resumeService.getResumeLog(params);

    expect(data).toBe(mockReturn.sort((a, b) => b.createdAt - a.createdAt));
    expect(mockResumeRepository.getResumeById).toHaveBeenCalledTimes(1);
    expect(mockResumeRepository.getResumeById).toHaveBeenCalledWith(params);
    expect(mockResumeRepository.getResumeLogById).toHaveBeenCalledTimes(1);
    expect(mockResumeRepository.getResumeLogById).toHaveBeenCalledWith(params);
  });

  //이력서 로그 조회 - 이력서 존재 X
  test('getResumeLog', async () => {
    const findMockReturn = undefined;
    mockResumeRepository.getResumeById.mockReturnValue(findMockReturn);
    const params = dummyResumes.getResumeLog.params.resumeId;
    try {
      const data = await resumeService.getResumeLog(params);
    } catch (err) {
      expect(mockResumeRepository.getResumeById).toHaveBeenCalledTimes(1);
      expect(mockResumeRepository.getResumeById).toHaveBeenCalledWith(params);
      expect(err).toEqual(new HttpError.NotFound(MESSAGES.RES.COMMON.FAILED));
    }
  });
});
