import Joi from 'joi';
import { RESUME_STATUS } from '../../const/status.const.js';
import { MESSAGES } from '../../const/messages.const.js';

const recruiterEditSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(RESUME_STATUS))
    .messages({
      'any.required': MESSAGES.RES.RECRUITER.STATUS.REQUIRED,
      'any.only': MESSAGES.RES.RECRUITER.STATUS.INVALID_FORMAT,
    }),
  reason: Joi.string().required().messages({
    'any.required': MESSAGES.RES.RECRUITER.REASON.REQUIRED,
  }),
});

const recruiterEditValidator = async (req, res, next) => {
  try {
    await recruiterEditSchema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

export { recruiterEditValidator };
