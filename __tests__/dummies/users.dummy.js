import bcrypt from 'bcrypt';
export const dummyUsers = {
  create: {
    params: {
      email: 'spartan@spartacodingclub.kr',
      password: '000000',
      name: '스파르탄',
    },
    return: {
      userId: 1,
      email: 'spartan@spartacodingclub.kr',
      password: await bcrypt.hash('000000', 10),
      name: '스파르탄',
      role: 'APPLICANT',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  findFirst: {
    params: {
      userId: 1,
      email: 'spartan@spartacodingclub.kr',
    },
    return: {
      userId: 1,
      email: 'spartan@spartacodingclub.kr',
      password: await bcrypt.hash('000000', 10),
      name: '스파르탄',
      role: 'APPLICANT',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  signIn: {
    params: {
      success: {
        email: 'spartan@spartacodingclub.kr',
        password: '000000',
      },
      fail: {
        email: 'spartan@spartacodingclub.kr',
        password: '111111',
      },
    },
  },
  logOut: {
    params: {
      userId: 1,
    },
    return: {
      userId: 1,
      email: 'spartan@spartacodingclub.kr',
      password: await bcrypt.hash('000000', 10),
      name: '스파르탄',
      role: 'APPLICANT',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
};

// [

//   {
//     userId: 2,
//     email: 'applicant@spartacodingclub.kr',
//     password: await bcrypt.hash('000000', 10),
//     name: '지원자',
//     role: 'APPLICANT',
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
//   {
//     userId: 3,
//     email: 'recruiter@spartacodingclub.kr',
//     password: await bcrypt.hash('000000', 10),
//     name: '채용 담당자',
//     role: 'RECRUITER',
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
// ];
