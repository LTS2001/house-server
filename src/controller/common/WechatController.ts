import { Context } from '@midwayjs/koa';
import { Controller, Get, Inject, Post, Query } from '@midwayjs/core';
import {
  AuthMiddleware,
  MenuMiddleware,
  RawBodyMiddleware,
} from '@/middleware/WechatMiddleware';
import { WechatService } from '@/service/common/WechatService';

@Controller('/')
export class WechatController {
  @Inject()
  private ctx: Context;
  @Inject()
  private wechatService: WechatService;

  @Get('/', { middleware: [AuthMiddleware, MenuMiddleware] })
  async home(@Query() query): Promise<string> {
    return query.echostr;
  }

  @Post('/', {
    middleware: [AuthMiddleware, MenuMiddleware, RawBodyMiddleware],
  })
  async postMain(): Promise<any> {
    const { messageObj } = this.ctx;
    return this.wechatService.responseToWechat(messageObj);
  }

  @Get('/open_id')
  async getOpenId(@Query() query) {
    const { code } = query;
    return await this.wechatService.getUserOpenId(code);
  }
}
