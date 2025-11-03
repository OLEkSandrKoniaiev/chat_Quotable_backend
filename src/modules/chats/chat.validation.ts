import Joi from 'joi';

export const createChatSchema = Joi.object({
  firstName: Joi.string().min(1).max(32).required().messages({
    'string.empty': 'firstName cannot be empty.',
    'string.min': 'firstName should have a minimum length of {#limit}.',
    'string.max': 'firstName should have a maximum length of {#limit}.',
    'any.required': 'firstName is a required field.',
  }),
  lastName: Joi.string().min(1).max(32).messages({
    'string.empty': 'lastName cannot be empty.',
    'string.min': 'lastName should have a minimum length of {#limit}.',
    'string.max': 'lastName should have a maximum length of {#limit}.',
  }),
  lastMessage: Joi.string().min(1).max(2048).messages({
    'string.empty': 'lastMessage cannot be empty.',
    'string.min': 'lastMessage should have a minimum length of {#limit}.',
    'string.max': 'lastMessage should have a maximum length of {#limit}.',
  }),
  // lastMessageTimestamp: Date and not required
  //   unreadCount: int number
});

export const updateChatSchema = Joi.object({
  firstName: Joi.string().min(1).max(32).messages({
    'string.empty': 'firstName cannot be empty.',
    'string.min': 'firstName should have a minimum length of {#limit}.',
    'string.max': 'firstName should have a maximum length of {#limit}.',
  }),
  lastName: Joi.string().min(1).max(32).messages({
    'string.empty': 'lastName cannot be empty.',
    'string.min': 'lastName should have a minimum length of {#limit}.',
    'string.max': 'lastName should have a maximum length of {#limit}.',
  }),
  avatarUrl: Joi.string().uri().allow(null, '').messages({
    'string.uri': 'avatarUrl must be a valid URL.',
  }),
});
