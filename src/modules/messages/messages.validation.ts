import Joi from 'joi';

export const createMessageSchema = Joi.object({
  content: Joi.string().min(1).max(2048).required().messages({
    'string.empty': 'content cannot be empty.',
    'string.min': 'content should have a minimum length of {#limit}.',
    'string.max': 'content should have a maximum length of {#limit}.',
    'any.required': 'content is a required field.',
  }),
  // sender: Joi.string().valid('user', 'bot').required().messages({
  //   'any.only': 'sender must be either "user" or "bot".',
  //   'any.required': 'sender is a required field.',
  // }),
});

export const updateMessageSchema = Joi.object({
  content: Joi.string().min(1).max(2048).required().messages({
    'string.empty': 'content cannot be empty.',
    'string.min': 'content should have a minimum length of {#limit}.',
    'string.max': 'content should have a maximum length of {#limit}.',
    'any.required': 'content is a required field.',
  }),
});
