export const MESSAGES = {
  AUTH: {
    COMMON: {
      EMAIL: {
        REQUIRED: '이메일을 입력해주세요.',
        INVALID_FORMAT: '이메일 형식이 올바르지 않습니다.',
        DUPLICATED: '이미 가입된 사용자입니다.',
      },
      PASSWORD: {
        REQUIRED: '비밀번호를 입력해주세요.',
        MIN_LENGTH: '비밀번호는 6자리 이상이어야 합니다.',
      },
      PASSWORD_CONFIRM: {
        REQUIRED: '비밀번호 확인을 입력해주세요.',
        NOT_MATCHED: '입력한 두 비밀번호가 일치하지 않습니다.',
      },
      NAME: {
        REQUIRED: '이름을 입력해주세요.',
      },
      SIGN_UP: {
        SUCCEED: '회원가입에 성공했습니다.',
      },
    },
  },
  RES: {
    CREATE: {
      TITLE: {
        REQUIRED: '제목을 입력해주세요.',
      },
      CONTENT: {
        REQUIRED: '내용을 입력해주세요.',
        MIN_LENGTH: '이력서 내용은 150자 이상 작성해야 합니다.',
      },
    },
    UPDATE: {
      REQUIRED: '수정할 내용을 입력해주세요.',
      MIN_LENGTH: '이력서 내용은 150자 이상 작성해야 합니다.',
    },
    RECRUITER: {
      STATUS: {
        REQUIRED: '변경하고자 하는 상태를 확인해주세요.',
        INVALID_FORMAT: '유효하지 않은 지원상태입니다.',
      },
      REASON: {
        REQUIRED: '지원 상태 변경 사유를 입력해주세요.',
      },
    },
  },
};
