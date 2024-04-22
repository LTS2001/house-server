import {BaseResponse} from "./BaseResponse"
import {ResponseCode} from "./ResponseFormat";

export class ResultUtils {
  /**
   * 成功的请求
   * @param data 成功的数据
   */
  success<T>(data: T): BaseResponse<T> {
    return new BaseResponse<T>(ResponseCode.SUCCESS, data);
  }

  // 重载签名
  error(code: number): BaseResponse<null>;
  error(code: number, message: string): BaseResponse<null>;
  /**
   * 错误的请求
   * @param code 状态码
   * @param message 错误信息
   */
  error(code: number, message?: string): BaseResponse<null> {
    return new BaseResponse<null>(code, null, message);
  }
}
