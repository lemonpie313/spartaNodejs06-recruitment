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
    },
    SIGN_UP: {
      ISEXIST: '이미 가입된 사용자입니다.',
      SUCCEED: '회원가입에 성공했습니다.',
    },
    SIGN_IN: {
      ISNOTEXIST: '회원 정보를 찾을 수 없습니다.',
      PW_NOT_MATCHED: '비밀번호가 일치하지 않습니다.',
      SUCCEED: '로그인 되었습니다.',
    },
    READ: {
      SUCCEED: '회원정보 조회에 성공하였습니다.',
    },
    LOGOUT: {
      SUCCEED: '로그아웃 되었습니다.',
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
  JWT: {
    NONE: '인증 정보가 없습니다.',
    NOT_TYPE: '지원하지 않는 인증방식입니다.',
    NO_MATCH: '인증 정보와 일치하는 사용자가 없습니다.',
    EXPIRED: '인증 정보가 만료되었습니다.',
    NOT_AVAILABLE: '인증 정보가 유효하지 않습니다.',
    ELSE: '비정상적인 접근입니다.',
  },
};
