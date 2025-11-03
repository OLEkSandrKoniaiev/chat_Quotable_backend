import Joi from 'joi';

// Minimum 8 characters, maximum 64.
// At least one uppercase letter, one lowercase letter, one number, one special character.
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+.,;:?'"{}[\]<>-])[A-Za-z\d!@#$%^&*()_+.,;:?'"{}[\]<>-]{8,64}$/;

// Joi's .email() is usually enough, but pattern() gives extra control.
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const createUserSchema = Joi.object({
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
  email: Joi.string().email().pattern(emailRegex).required().messages({
    'string.empty': 'email cannot be empty.',
    'string.email': 'email must be a valid email address.',
    'string.pattern.base': 'email format is invalid.',
    'any.required': 'email is a required field.',
  }),
  password: Joi.string().pattern(passwordRegex).required().messages({
    'string.empty': 'password cannot be empty.',
    'string.pattern.base':
      'password must be 8-64 characters long and include uppercase, lowercase, numbers, and symbols.',
    'any.required': 'password is a required field.',
  }),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().pattern(emailRegex).required().messages({
    'string.empty': 'email cannot be empty.',
    'string.email': 'email must be a valid email address.',
    'string.pattern.base': 'email format is invalid.',
    'any.required': 'email is a required field.',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'password cannot be empty.',
    'any.required': 'password is a required field.',
  }),
});

export const updateUserSchema = Joi.object({
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
