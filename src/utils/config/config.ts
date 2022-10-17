import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  PORT: Joi.number().required(),
  // JWT_SECRET: Joi.string().min(16).required(),
  MYSQL_HOST: Joi.string().required(),
  MYSQL_PORT: Joi.number().required(),
  MYSQL_USER: Joi.string().required(),
  MYSQL_PASSWORD: Joi.string().allow('', null),
  MYSQL_DATABASE: Joi.string().required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  // REDIS_URL: Joi.string().required(),
  KAKAO_AUTH_ACCESS_LINK: Joi.string().required(),
  NAVER_AUTH_ACCESS_LINK: Joi.string().required(),
  // MAIL_HOST: Joi.string().required(),
  // MAIL_USER: Joi.string().required(),
  // MAIL_PASS: Joi.string().required(),
  //   MAIL_FROM: Joi.string().required(),
  //   MAIL_ADMIN: Joi.string().required(),
  AWS_BUCKET_NAME: Joi.string().required(),
  AWS_ACCESS_KEY: Joi.string().required(),
  AWS_SECRET_KEY: Joi.string().required(),
  AWS_REGION: Joi.string().required(),
  // AWS_ENDPOINT: Joi.string().required(),
  AWS_CLOUDFRONT: Joi.string().required(),
  //   AI_HOST: Joi.string().required(),
  //   AI_KEY: Joi.string().required(),
  APPLE_AUTH_KEY_URL: Joi.string().required(),
  APPLE_URL: Joi.string().required(),
  APPLE_CLIENT_ID: Joi.string().required(),
  //   BE_FAMILY_HOST: Joi.string().required(),
});

export const config = () => ({
  host: {
    port: Number(process.env.PORT),
    jwtSecret: process.env.JWT_SECRET,
  },

  mysqldb: {
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: !!process.env.SYNCHRONIZE_DATA,
    bigNumberStrings: false,
    supportBigNumbers: true,
    logging: true,
    extra: {
      decimalNumbers: true,
    },
  },

  redis: {
    host: process.env.REDIS_HOST,
  },
});
