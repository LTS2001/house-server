import { MidwayConfig } from '@midwayjs/core';
import * as dotenv from 'dotenv';
dotenv.config();
export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1700985031838_8605',
  koa: {
    port: 7002,
    bodyParser: {
      jsonLimit: '100mb',
      formLimit: '100mb',
      textLimit: '100mb',
    },
  },
  webSocket: {
    port: 7003,
  },
  orm: {
    database: process.env.MYSQL_DATABASE || '',
    username: process.env.MYSQL_USERNAME || '',
    password: process.env.MYSQL_PASSWORD || '',
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: process.env.MYSQL_PORT || 3306,
    type: 'mysql',
    logging: false,
  },
  redis: {
    client: {
      port: process.env.REDIS_PORT || 6379,
      host: process.env.REDIS_HOST || '127.0.0.1',
      password: process.env.REDIS_PASSWORD || undefined,
    },
  },
  i18n: {
    defaultLocale: 'zh_CN',
  },
  cors: {
    credentials: true,
  },
  jwt: {
    secret: 'mini house',
    expiresIn: '10d',
  },
  upload: {
    tmpdir: process.env.UPLOAD_TMPDIR || undefined,
    cleanTimeout: 0,
    fileSize: '100mb',
  },
} as MidwayConfig;
