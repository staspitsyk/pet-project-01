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

    mongo: Joi.object({
      dbName: Joi.string().required(),
      username: Joi.string().required(),
      password: Joi.string().required(),
      uri: Joi.string().required(),
    }).required(),

    redis: Joi.object({
      host: Joi.string().required(),
      port: Joi.number().required(),
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

    clientUiConfig: Joi.object({
      key: Joi.string().required(),
    }).required(),
  }).required(),

  app: Joi.object({
    port: Joi.number().required(),
  }).required(),

  auth: Joi.object({
    jwt: Joi.object({
      secret: Joi.string().required(),
      expiresInS: Joi.number().required(),
    }).required(),
  }).required(),
});
