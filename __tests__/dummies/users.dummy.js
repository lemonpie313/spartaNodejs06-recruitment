import bcrypt from 'bcrypt';
export const dummyUsers = [
  {
    // 새롭게 생성하는 사용자 데이터
    email: 'spartan@spartacodingclub.kr',
    password: 'spartan!!123',
    name: '스파르탄',
  },
  {
    userId: 1,
    email: 'spartan@spartacodingclub.kr',
    password: await bcrypt.hash('000000', 10),
    name: '스파르탄',
    role: 'APPLICANT',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userId: 2,
    email: 'applicant@spartacodingclub.kr',
    password: await bcrypt.hash('000000', 10),
    name: '지원자',
    role: 'APPLICANT',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userId: 3,
    email: 'recruiter@spartacodingclub.kr',
    password: await bcrypt.hash('000000', 10),
    name: '채용 담당자',
    role: 'RECRUITER',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
