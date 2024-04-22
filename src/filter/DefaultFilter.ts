import {Catch} from '@midwayjs/core';
import {ResultUtils} from "@/common/ResultUtils";
import {ResponseCode} from "@/common/ResponseFormat";
import {Context} from "@midwayjs/koa";

/**
 * 默认异常处理
 */
@Catch()
export class DefaultFilter {
  async catch(err: Error, ctx: Context) {
    // 所有的未分类错误会到这里
    ctx.logger.error(err);
    return new ResultUtils().error(ResponseCode.SYSTEM_ERROR, err.message);
  }
}
