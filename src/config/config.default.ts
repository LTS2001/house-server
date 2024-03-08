import { MidwayConfig } from '@midwayjs/core';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1700985031838_8605',
  koa: {
    port: 7001,
  },
  webSocket: {
    port: 7002,
  },
  orm: {
    type: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'house',
    synchronize: true,     // 如果第一次使用，不存在表，有同步的需求可以写 true
    logging: false,
  },
  redis: {
    client: {
      port: 6379,
      host: '127.0.0.1',
      password: '123456',
      db: 0,
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
    expiresIn: '1d',
  },
  upload: {
    tmpdir: 'F:/GraduationDesign/static-img',
    cleanTimeout: 0,
  }
} as MidwayConfig;
