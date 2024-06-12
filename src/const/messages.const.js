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
      IS_EXIST: '이미 가입된 사용자입니다.',
      SUCCEED: '회원가입에 성공했습니다.',
    },
    SIGN_IN: {
      IS_NOT_EXIST: '회원 정보를 찾을 수 없습니다.',
      PW_NOT_MATCHED: '비밀번호가 일치하지 않습니다.',
      SUCCEED: '로그인 되었습니다.',
    },
    READ: {
      SUCCEED: '회원정보 조회에 성공하였습니다.',
    },
    TOKEN: {
      SUCCEED: '토큰 생성이 완료되었습니다.',
    },
    LOGOUT: {
      SUCCEED: '로그아웃 되었습니다.',
    },
  },
  RES: {
    CREATE: {
      TITLE_REQUIRED: '제목을 입력해주세요.',
      CONTENT_REQUIRED: '내용을 입력해주세요.',
      CONTENT_MIN_LENGTH: '이력서 내용은 150자 이상 작성해야 합니다.',
      SUCCEED: '이력서 작성이 완료되었습니다.',
    },
    READ: {
      SORT: {
        INVALID_FORMAT: '정렬 방식이 올바르지 않습니다.',
      },
      SUCCEED: '이력서 조회에 성공했습니다.',
    },
    READ_ONE: {
      SUCCEED: '이력서 상세조회에 성공했습니다.',
    },
    UPDATE: {
      TITLE_REQUIRED: '수정할 제목을 입력해주세요.',
      CONTENT_REQUIRED: '수정할 내용을 입력해주세요.',
      CONTENT_MIN_LENGTH: '이력서 내용은 150자 이상 작성해야 합니다.',
      SUCCEED: '이력서 수정이 완료되었습니다.',
    },
    DELETE: {
      SUCCEED: '이력서 삭제가 완료되었습니다.',
    },
    COMMON: {
      FAILED: '이력서가 존재하지 않습니다.',
    },
  },
  RECRUITER: {
    UPDATE: {
      FAILED: '이력서가 존재하지 않습니다.',
      STATUS_REQUIRED: '변경하고자 하는 상태를 확인해주세요.',
      INVALID_FORMAT: '유효하지 않은 지원상태입니다.',
      REASON_REQUIRED: '지원 상태 변경 사유를 입력해주세요.',
      SUCCEED: '이력서 상태 수정이 완료되었습니다.',
    },
    LOG: {
      FAILED: '이력서가 존재하지 않습니다.',
      SUCCEED: '이력서 로그 조회에 성공하였습니다.',
    },
  },
  JWT: {
    NONE: '인증 정보가 없습니다.',
    NOT_TYPE: '지원하지 않는 인증방식입니다.',
    NO_MATCH: '인증 정보와 일치하는 사용자가 없습니다.',
    EXPIRED: '인증 정보가 만료되었습니다.',
    NOT_AVAILABLE: '인증 정보가 유효하지 않습니다.',
    DISCARDED: '폐기된 인증정보입니다.',
    ELSE: '비정상적인 접근입니다.',
  },
  ROLE: {
    FORBIDDEN: '접근 권한이 없습니다.',
    ERROR: '비정상적인 접근입니다.',
  },
  ERROR: '예상치 못한 에러가 발생했습니다. 관리자에게 문의해 주세요.',
};
