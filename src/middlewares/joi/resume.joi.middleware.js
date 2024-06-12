import Joi from 'joi';
import { MESSAGES } from '../../const/messages.const.js';

const createResumeSchema = Joi.object({
  title: Joi.string().required().messages({
    'any.required': MESSAGES.RES.CREATE.TITLE_REQUIRED,
    'string.empty': MESSAGES.RES.CREATE.TITLE_REQUIRED,
  }),
  content: Joi.string().required().min(150).messages({
    'any.required': MESSAGES.RES.CREATE.CONTENT_REQUIRED,
    'string.empty': MESSAGES.RES.CREATE.CONTENT_REQUIRED,
    'string.min': MESSAGES.RES.CREATE.CONTENT_MIN_LENGTH,
  }),
});

const editResumeSchema = Joi.object({
  title: Joi.string().messages({
    'string.empty': MESSAGES.RES.CREATE.TITLE_REQUIRED,
  }),
  content: Joi.string().min(150).messages({
    'string.empty': MESSAGES.RES.UPDATE.CONTENT_REQUIRED,
    'string.min': MESSAGES.RES.UPDATE.CONTENT_MIN_LENGTH,
  }),
});

const createResumeValidator = async (req, res, next) => {
  try {
    await createResumeSchema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

const editResumeValidator = async (req, res, next) => {
  try {
    await editResumeSchema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

export { createResumeValidator, editResumeValidator };
