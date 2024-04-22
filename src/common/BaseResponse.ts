import {ResponseCode, ResponseMsg} from "./ResponseFormat";

export class BaseResponse<T> {
  readonly code: number;
  readonly data: T;
  readonly message: string;

  // 重载签名
  constructor(code: number);
  constructor(code: number, data: T);
  constructor(code: number, data: T, message: string);
  constructor(code: number, data: T | null = null, messages: string = '') {
    this.code = code;
    this.data = data;
    this.message = messages || ResponseMsg[ResponseCode[code]];
  }
}
