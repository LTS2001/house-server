import { IMiddleware, Middleware } from '@midwayjs/core';
import { NextFunction, Context } from '@midwayjs/koa';
import { officialConfig } from '../config/config.wechat';
import { WechatUtil } from '../utils/WechatUtil';
import sha1 = require('sha1');
import getRawBody = require('raw-body');
import axios from 'axios';

/**
 * 身份验证中间件
 */
@Middleware()
export class AuthMiddleware implements IMiddleware<Context, NextFunction> {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const { signature, timestamp, nonce } = ctx.query;
      const { token } = officialConfig;
      // 获取access_token
      ctx.access_token = await WechatUtil.getAccessToken();
      /**
       * 验证该请求是否来自微信服务器
       * 1）将token、timestamp、nonce三个参数进行字典序排序
       * 2）将三个参数字符串拼接成一个字符串进行sha1加密
       * 3）开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
       */
      const combinationStr = sha1([token, timestamp, nonce].sort().join(''));
      if (signature === combinationStr) {
        await next();
      } else {
        return '';
      }
    };
  }
}

/**
 * 解析body中间件
 */
@Middleware()
export class RawBodyMiddleware implements IMiddleware<Context, NextFunction> {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      // 获取xml数据对象
      const xml = await getRawBody(ctx.req, {
        length: ctx.request.length,
        limit: '1mb',
        encoding: ctx.request.charset || 'utf-8',
      });
      ctx.xml = xml;
      // 转化xml并格式化
      const messageObj: any = await WechatUtil.formatMessage(
        ((await WechatUtil.parseXML(xml)) as any).xml
      );
      ctx.messageObj = messageObj;
      const body = await next();
      return WechatUtil.reply(
        body,
        messageObj.ToUserName,
        messageObj.FromUserName
      );
    };
  }
}

/**
 * 获取底部菜单中间件
 */
@Middleware()
export class MenuMiddleware implements IMiddleware<Context, NextFunction> {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      console.log(ctx.access_token);
      axios.post(
        `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${ctx.access_token}`,
        {
          button: [
            {
              type: 'click',
              name: '今日歌曲',
              key: 'V1001_TODAY_MUSIC',
            },
            {
              name: '菜单',
              sub_button: [
                {
                  type: 'view',
                  name: '搜索',
                  url: 'http://www.soso.com/',
                },
                {
                  type: 'miniprogram',
                  name: 'wxa',
                  url: 'http://mp.weixin.qq.com',
                  appid: 'wx286b93c14bbf93aa',
                  pagepath: 'pages/lunar/index',
                },
                {
                  type: 'click',
                  name: '赞一下我们',
                  key: 'V1001_GOOD',
                },
              ],
            },
          ],
        }
      );
      await next();
    };
  }
}
