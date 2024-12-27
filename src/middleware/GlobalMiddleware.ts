import { Landlord } from '@/entities/Landlord';
import { Tenant } from '@/entities/Tenant';
import { InfoFilterUtil } from '@/utils/InfoFilterUtil';
import { Middleware, IMiddleware } from '@midwayjs/core';
import { NextFunction, Context } from '@midwayjs/koa';

@Middleware()
export class GlobalMiddleware implements IMiddleware<Context, NextFunction> {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      // 控制器前执行的逻辑
      const startTime = Date.now();
      // 执行下一个 Web 中间件，最后执行到控制器
      // 这里可以拿到下一个中间件或者控制器的返回值
      const result = await next();
      // 控制器之后执行的逻辑
      ctx.logger.info(
        `Report in "src/middleware/GlobalMiddleware.ts", rt = ${
          Date.now() - startTime
        }ms`
      );
      // 作为全局中间件，需要过滤掉敏感信息（密码、身份证信息）
      const data = result?.data;
      if (data instanceof Array) {
        // 返回的是数组
        for (let idx = 0; idx < data.length; idx++) {
          const item = data[idx];
          if (item instanceof Landlord || item instanceof Tenant) {
            InfoFilterUtil.filterUserSensitive(item);
          } else {
            break;
          }
        }
      } else {
        // 返回的是对象
        if (data instanceof Landlord || data instanceof Tenant) {
          InfoFilterUtil.filterUserSensitive(data);
        }
      }
      // 返回给上一个中间件的结果
      return result;
    };
  }

  static getName(): string {
    return 'Global';
  }
}
