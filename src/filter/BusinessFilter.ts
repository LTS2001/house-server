import {Catch} from "@midwayjs/core";
import {BusinessException} from "@/exception/BusinessException";
import {ResultUtils} from "@/common/ResultUtils";
import {Context} from "@midwayjs/koa";

/**
 * 业务异常处理
 */
@Catch(BusinessException)
export class BusinessFilter {
  async catch(err: BusinessException, ctx: Context) {
    ctx.logger.error(err);
    return new ResultUtils().error(err.status, err.message);
  }
}
