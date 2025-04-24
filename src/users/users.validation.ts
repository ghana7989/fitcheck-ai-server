import Joi from 'joi';

// Schema for user registration
export const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

// Schema for user login
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Schema for token refresh
export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required()
}); 
