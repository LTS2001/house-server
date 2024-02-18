import {IMiddleware, Inject, Middleware} from "@midwayjs/core";
import {Context, NextFunction} from "@midwayjs/koa";
import {RedisService} from "@midwayjs/redis";
import {SESSION_KEY} from "../constant/userConstant";
import {BusinessException} from "../exception/BusinessException";
import {ResponseCode} from "../common/ResponseFormat";

@Middleware()
export class SessionMiddleware implements IMiddleware<Context, NextFunction> {
  @Inject()
  redisServer: RedisService;

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const userInfoStr = await this.redisServer.get(ctx.session[SESSION_KEY]);
      if (!userInfoStr) {
        throw new BusinessException(ResponseCode.NOT_LOGIN_ERROR);
      }
      const userInfo = JSON.parse(userInfoStr);
      // 将当前用户的角色保存起来，在后面作为路由守卫中进行判断
      ctx.user = userInfo;
      await next();
    }
  }

  public static getName(): string {
    return 'SessionMiddleware';
  }
}
