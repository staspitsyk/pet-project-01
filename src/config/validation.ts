import * as Joi from 'joi';

export const validationSchema = Joi.object({
  database: Joi.object({
    postgres: Joi.object({
      type: Joi.string().required(),
      host: Joi.string().required(),
      port: Joi.number().required(),
      username: Joi.string().required(),
      password: Joi.string().required(),
      database: Joi.string().required(),
    }).required(),
  }).required(),
  app: Joi.object({
    port: Joi.number().required(),
  }).required(),
});