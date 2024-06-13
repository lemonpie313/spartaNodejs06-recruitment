import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { ResumeController } from '../../../src/controllers/resume.controller.js';
import { dummyResumes } from '../../dummies/resumes.dummy.js';
import { HTTP_STATUS } from '../../../src/const/http-status.const.js';
import { MESSAGES } from '../../../src/const/messages.const.js';

const mockResumeService = {
  createResume: jest.fn(),
  getAllResumes: jest.fn(),
  getResume: jest.fn(),
  updateResume: jest.fn(),
  deleteResume: jest.fn(),
};

const mockRequest = {
  user: jest.fn(),
  body: jest.fn(),
  query: jest.fn(),
  params: jest.fn(),
};

const mockResponse = {
  status: jest.fn(),
  json: jest.fn(),
};

const mockNext = jest.fn();

const resumeController = new ResumeController(mockResumeService);

describe('ResumeController Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    mockResponse.status.mockReturnValue(mockResponse);
  });

  //이력서 생성
  test('createResume', async () => {
    const mockReturn = {
      resumeId: dummyResumes.create.return.resumeId,
      title: dummyResumes.create.return.title,
      status: dummyResumes.create.return.status,
      createdAt: dummyResumes.create.return.createdAt,
      updatedAt: dummyResumes.create.return.updatedAt,
    };
    mockResumeService.createResume.mockReturnValue(mockReturn);

    const params = [dummyResumes.create.params.userId, dummyResumes.create.params.title, dummyResumes.create.params.content];
    mockRequest.body = {
      title: params[1],
      content: params[2],
    };
    mockRequest.user = { userId: params[0] };
    await resumeController.createResume(mockRequest, mockResponse, mockNext);

    expect(mockResumeService.createResume).toHaveBeenCalledTimes(1);
    expect(mockResumeService.createResume).toHaveBeenCalledWith(...params);

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);

    expect(mockResponse.json).toHaveBeenCalledWith({
      status: HTTP_STATUS.CREATED,
      message: MESSAGES.RES.CREATE.SUCCEED,
      data: { resume: mockReturn },
    });
  });

  //이력서 목록 조회
  test('getAllResumes', async () => {
    const mockReturn = dummyResumes.findMany;
    mockResumeService.getAllResumes.mockReturnValue(mockReturn);

    const params = [1, 'RECRUITER', 'ASC', 'APPLY'];
    mockRequest.user = {
      userId: params[0],
      role: params[1],
    };
    mockRequest.query = {
      sort: params[2],
      status: params[3],
    };
    await resumeController.getAllResumes(mockRequest, mockResponse, mockNext);

    expect(mockResumeService.getAllResumes).toHaveBeenCalledTimes(1);
    expect(mockResumeService.getAllResumes).toHaveBeenCalledWith(...params);

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.OK);

    expect(mockResponse.json).toHaveBeenCalledWith({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RES.READ.SUCCEED,
      data: { resumes: mockReturn },
    });
  });

  //이력서 목록 조회 > 쿼리 입력 없을 경우

  //이력서 상세 조회
  test('getResume', async () => {
    const mockReturn = dummyResumes.findFirst.return;
    mockResumeService.getResume.mockReturnValue(mockReturn);

    const params = [1, 'RECRUITER', 1];
    mockRequest.user = {
      userId: params[0],
      role: params[1],
    };
    mockRequest.params = { id: String(params[2]) };
    await resumeController.getResume(mockRequest, mockResponse, mockNext);

    expect(mockResumeService.getResume).toHaveBeenCalledTimes(1);
    expect(mockResumeService.getResume).toHaveBeenCalledWith(...params);

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.OK);

    expect(mockResponse.json).toHaveBeenCalledWith({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RES.READ_ONE.SUCCEED,
      data: { resume: mockReturn },
    });
  });

  //이력서 수정
  test('updateResume', async () => {
    const mockReturn = dummyResumes.update.return;
    mockResumeService.updateResume.mockReturnValue(mockReturn);

    const params = [
      dummyResumes.update.params.userId,
      dummyResumes.update.params.resumeId,
      dummyResumes.update.params.title,
      dummyResumes.update.params.content,
    ];
    mockRequest.user = { userId: params[0] };
    mockRequest.params = { id: String(params[1]) };
    mockRequest.body = {
      title: params[2],
      content: params[3],
    };
    await resumeController.updateResume(mockRequest, mockResponse, mockNext);

    expect(mockResumeService.updateResume).toHaveBeenCalledTimes(1);
    expect(mockResumeService.updateResume).toHaveBeenCalledWith(...params);

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.OK);

    expect(mockResponse.json).toHaveBeenCalledWith({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RES.UPDATE.SUCCEED,
      data: { resume: mockReturn },
    });
  });

  //이력서 삭제
  test('deleteResume', async () => {
    const params = [dummyResumes.delete.params.userId, dummyResumes.delete.params.resumeId];
    mockRequest.user = { userId: params[0] };
    mockRequest.params = { id: String(params[1]) };
    await resumeController.deleteResume(mockRequest, mockResponse, mockNext);

    expect(mockResumeService.deleteResume).toHaveBeenCalledTimes(1);
    expect(mockResumeService.deleteResume).toHaveBeenCalledWith(...params);

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.OK);

    expect(mockResponse.json).toHaveBeenCalledWith({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RES.DELETE.SUCCEED,
      data: { userId: params[0] },
    });
  });
});
