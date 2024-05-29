import { HTTP_STATUS } from '../const/http-status.const.js';

export default function (err, req, res, next) {
  console.error(err);

  if (err.name === 'ValidationError') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      status: HTTP_STATUS.BAD_REQUEST,
      message: err.message,
    });
  }

  return res.status(500).json({
    status: 500,
    message: '예상치 못한 에러가 발생했습니다. 관리자에게 문의해 주세요.',
  });
}
