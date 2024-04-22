import {Catch, httpError, MidwayHttpError} from '@midwayjs/core';
import {Context} from '@midwayjs/koa';

/**
 * notfound异常处理
 */
@Catch(httpError.NotFoundError)
export class NotfoundFilter {
  async catch(err: MidwayHttpError, ctx: Context) {
    ctx.logger.error(err);
    // 404 错误会到这里
    ctx.redirect('/404.html');
  }
}
