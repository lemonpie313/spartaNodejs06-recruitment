export class ResumeRepository {
  constructor(prisma, Prisma) {
    this.prisma = prisma;
    this.Prisma = Prisma;
  }

  //이력서 생성
  createResume = async (userId, title, content) => {
    const myResume = await this.prisma.resumes.create({
      data: {
        userId,
        title,
        content,
      },
    });
    return myResume;
  };

  //모든 이력서 목록 조회
  getAllResumes = async () => {
    const resumes = await this.prisma.resumes.findMany({
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
    return resumes;
  };

  //아이디에 해당하는 이력서 목록 조회
  getAllResumesById = async (userId) => {
    const resumes = await this.prisma.resumes.findMany({
      where: {
        userId,
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
    return resumes;
  };

  //이력서 상세조회
  getResumeById = async (resumeId) => {
    const resume = await this.prisma.resumes.findFirst({
      where: {
        resumeId,
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
    return resume;
  };

  //내 이력서 상세조회
  getResumeByUserId = async (userId, resumeId) => {
    const resume = await this.prisma.resumes.findFirst({
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
        resumeId: true,
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
    const resume = await this.prisma.resumes.update({
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
    await this.prisma.resumes.delete({
      where: {
        userId,
        resumeId,
      },
    });
  };

  //채용관리자 이력서 상태 수정
  updateResumeStatus = async (userId, resumeId, status, reason, previousStatus) => {
    const resumeLog = await this.prisma.$transaction(
      async (tx) => {
        await tx.resumes.update({
          data: {
            status,
          },
          where: {
            resumeId: +resumeId,
          },
        });

        const resumeLog = await tx.resumeLog.create({
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

        return resumeLog;
      },
      {
        isolationLevel: this.Prisma.TransactionIsolationLevel.ReadCommitted,
      },
    );
    return resumeLog;
  };

  //채용관리자 이력서 로그 조회
  getResumeLogById = async (resumeId) => {
    const resumeLog = await this.prisma.resumeLog.findMany({
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
