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
      synchronize: Joi.boolean().required(),
      entities: Joi.array().items(Joi.string()),
    }).required(),
  }).required(),

  kafka: Joi.object({
    broker: Joi.string().required(),
  }).required(),

  features: Joi.object({
    levelConfig: Joi.object({
      topics: Joi.object({
        levelConfigHistoryTopic: Joi.string().required(),
      }).required(),
    }).required(),
  }).required(),

  app: Joi.object({
    port: Joi.number().required(),
  }).required(),
});
