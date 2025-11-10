import Joi from 'joi';

export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const characterSchema = Joi.object({
  name: Joi.string().min(1).max(50).required(),
  description: Joi.string().min(1).max(500).required(),
  personality: Joi.string().min(1).max(1000).required(),
  avatar: Joi.string().uri().required(),
  background: Joi.string().max(1000).optional(),
  greeting: Joi.string().max(200).optional(),
  isPublic: Joi.boolean().default(true),
  tags: Joi.array().items(Joi.string().max(20)).optional()
});

export const messageSchema = Joi.object({
  content: Joi.string().min(1).max(2000).required()
});