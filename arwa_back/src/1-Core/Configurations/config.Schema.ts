import * as Joi from 'joi';

export const configSchema = Joi.object({
  PORT: Joi.number().default(process.env.PORT || 3000),
  STAGE: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
});
