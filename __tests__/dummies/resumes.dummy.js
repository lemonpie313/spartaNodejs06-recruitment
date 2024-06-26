import { dummyUsers } from './users.dummy.js';

export const dummyResumes = {
  create: {
    params: {
      userId: 1,
      title: '튼튼한 개발자 스파르탄',
      content:
        '저는 튼튼함을 제 자랑거리로 선보일 수 있습니다. 어떤 도전이든 두려워하지 않고, 견고한 코드와 해결책을 제시할 자신이 있습니다. 복잡한 문제에 직면했을 때에도 냉정하게 분석하고 빠르게 대응하는 능력을 갖췄습니다. 또한, 팀원들과의 원활한 커뮤니케이션을 통해 프로젝트의 성공을 이끌어내는데 기여할 것입니다. 최고의 결과물을 위해 끊임없이 노력하며, 스파르타코딩클럽에서도 이 같은 튼튼함을 발휘하여 뛰어난 성과를 이루고자 합니다.',
    },
    return: {
      userId: 1,
      resumeId: 1,
      title: '튼튼한 개발자 스파르탄',
      status: 'APPLY',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  findMany: [
    {
      users: {
        name: '스파르탄',
      },
      resumeId: 1,
      title: '튼튼한 개발자 스파르탄',
      status: 'APPLY',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      users: {
        name: '스파르탄',
      },
      resumeId: 2,
      title: '튼튼하고 영리한 개발자 스파르탄',
      status: 'PASS',
      createdAt: new Date(new Date().getTime() + 1000),
      updatedAt: new Date(new Date().getTime() + 1000),
    },
    {
      users: {
        name: '지원자',
      },
      resumeId: 3,
      title: '창의적인 기획자 지원자',
      status: 'APPLY',
      createdAt: new Date(new Date().getTime() + 2000),
      updatedAt: new Date(new Date().getTime() + 2000),
    },
    {
      users: {
        name: '지원자',
      },
      resumeId: 4,
      title: '창의적이고 우직한 기획자 지원자',
      status: 'INTERVIEW1',
      createdAt: new Date(new Date().getTime() + 3000),
      updatedAt: new Date(new Date().getTime() + 3000),
    },
  ],
  findFirst: {
    params: {
      userId: 1,
      resumeId: 1,
    },
    return: {
      users: {
        name: '스파르탄',
      },
      resumeId: 1,
      title: '튼튼한 개발자 스파르탄',
      content:
        '저는 튼튼함을 제 자랑거리로 선보일 수 있습니다. 어떤 도전이든 두려워하지 않고, 견고한 코드와 해결책을 제시할 자신이 있습니다. 복잡한 문제에 직면했을 때에도 냉정하게 분석하고 빠르게 대응하는 능력을 갖췄습니다. 또한, 팀원들과의 원활한 커뮤니케이션을 통해 프로젝트의 성공을 이끌어내는데 기여할 것입니다. 최고의 결과물을 위해 끊임없이 노력하며, 스파르타코딩클럽에서도 이 같은 튼튼함을 발휘하여 뛰어난 성과를 이루고자 합니다.',
      status: 'APPLY',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  update: {
    params: {
      userId: 1,
      resumeId: 1,
      title: '튼튼한 개발자 스파르탄22',
      content:
        '저는 튼튼함을 제 자랑거리로 선보일 수 있습니다. 어떤 도전이든 두려워하지 않고, 견고한 코드와 해결책을 제시할 자신이 있습니다. 복잡한 문제에 직면했을 때에도 냉정하게 분석하고 빠르게 대응하는 능력을 갖췄습니다. 또한, 팀원들과의 원활한 커뮤니케이션을 통해 프로젝트의 성공을 이끌어내는데 기여할 것입니다. 최고의 결과물을 위해 끊임없이 노력하며, 스파르타코딩클럽에서도 이 같은 튼튼함을 발휘하여 뛰어난 성과를 이루고자 합니다.',
    },
    findFirst: {
      userId: 1,
      resumeId: 1,
      title: '튼튼한 개발자 스파르탄',
      status: 'APPLY',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    return: {
      userId: 1,
      resumeId: 1,
      title: '튼튼한 개발자 스파르탄22',
      content:
        '저는 튼튼함을 제 자랑거리로 선보일 수 있습니다. 어떤 도전이든 두려워하지 않고, 견고한 코드와 해결책을 제시할 자신이 있습니다. 복잡한 문제에 직면했을 때에도 냉정하게 분석하고 빠르게 대응하는 능력을 갖췄습니다. 또한, 팀원들과의 원활한 커뮤니케이션을 통해 프로젝트의 성공을 이끌어내는데 기여할 것입니다. 최고의 결과물을 위해 끊임없이 노력하며, 스파르타코딩클럽에서도 이 같은 튼튼함을 발휘하여 뛰어난 성과를 이루고자 합니다.',
      status: 'APPLY',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  delete: {
    params: {
      userId: 1,
      resumeId: 1,
    },
    findFirst: {
      userId: 1,
      resumeId: 1,
      title: '튼튼한 개발자 스파르탄',
      status: 'APPLY',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  statusUpdate: {
    params: {
      userId: 1,
      resumeId: 1,
      status: 'DROP',
      reason: '부적합',
      previousStatus: 'APPLY',
    },
    findFirst: {
      userId: 1,
      resumeId: 1,
      title: '튼튼한 개발자 스파르탄',
      status: 'APPLY',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    return: {
      resumeLogId: 1,
      recruiterId: 2,
      resumeId: 1,
      previousStatus: 'APPLY',
      status: 'DROP',
      reason: '부적합',
      createdAt: new Date(),
    },
  },
  getResumeLog: {
    params: {
      resumeId: 1,
    },
    findFirst: {
      userId: 1,
      resumeId: 1,
      title: '튼튼한 개발자 스파르탄',
      status: 'APPLY',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    return: [
      {
        resumeLogId: 1,
        users: {
          name: '스파르탄',
        },
        resumeId: 1,
        previousStatus: 'APPLY',
        status: 'DROP',
        reason: '부적합',
        createdAt: new Date(),
      },
    ],
  },
};
