import Joi from 'joi';
import { MESSAGES } from '../../const/messages.const.js';

const schema = Joi.object({
  title: Joi.string().required().messages({
    'any.required': MESSAGES.RES.COMMON.TITLE.REQUIRED,
  }),
  content: Joi.string().required().min(150).messages({
    'any.required': MESSAGES.RES.COMMON.CONTENT.REQUIRED,
    'string.min': MESSAGES.RES.COMMON.CONTENT.MIN_LENGTH,
  }),
});

export const resumeValidator = async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
