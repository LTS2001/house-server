import {Catch} from "@midwayjs/core";
import {MidwayValidationError} from "@midwayjs/validate";
import {ResultUtils} from "@/common/ResultUtils";
import {Context} from "@midwayjs/koa";
import {ResponseCode} from "@/common/ResponseFormat";

/**
 * 参数校验错误异常处理
 */
@Catch(MidwayValidationError)
export class ValidationFilter {
  async catch(err: MidwayValidationError, ctx: Context) {
    ctx.logger.error(err);
    return new ResultUtils().error(ResponseCode.PARAMS_ERROR, err.message);
  }
}
