import {MidwayHttpError} from "@midwayjs/core";

/**
 * 定义业务异常类型
 */
export class BusinessException extends MidwayHttpError {
  constructor(code: number, msg: string = '') {
    super(msg, code);
  }
}
