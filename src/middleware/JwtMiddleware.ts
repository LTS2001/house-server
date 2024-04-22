import { Inject, Middleware } from '@midwayjs/core';
import { Context, NextFunction } from '@midwayjs/koa';
import { JwtService } from '@midwayjs/jwt';
import { RedisService } from '@midwayjs/redis';
import { AuthUtil } from '@/utils/AuthUtil';
import { BusinessException } from '@/exception/BusinessException';
import { ResponseCode } from '@/common/ResponseFormat';

@Middleware()
export class JwtMiddleware {
  @Inject()
  jwtService: JwtService;
  @Inject()
  redisService: RedisService;

  public static getName(): string {
    return 'jwt';
  }

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      // 判断下有没有校验信息
      if (!ctx.header['authorization']) {
        throw new BusinessException(ResponseCode.NOT_LOGIN_ERROR);
      }
      const decryptPhone = await new AuthUtil().getUserFromToken(ctx, this.jwtService);
      // 从redis中获取用户信息
      const userInfoStr = await this.redisService.get(decryptPhone);
      // if (!userInfoStr) {
      //   throw new BusinessException(ResponseCode.NOT_LOGIN_ERROR);
      // }
      // 将当前用户的角色保存起来，在后面作为路由守卫中进行判断
      ctx.user = JSON.parse(userInfoStr);
      await next();
    };
  };
}
