import {Context} from "@midwayjs/koa";
import {httpError} from "@midwayjs/core";
import {CryptoUtil} from "./CryptoUtil";
import {BusinessException} from "../exception/BusinessException";
import {ResponseCode} from "../common/ResponseFormat";
import {JwtService} from "@midwayjs/jwt";

export default class AuthUtil {


  /**
   * 从Token获取用户信息
   * @param ctx 上下文
   * @return decryptPhone 解密后的手机号
   */
  async getUserFromToken(ctx: Context, jwtService: JwtService) {

    // 从 header 上获取校验信息
    const parts = ctx.get('authorization').trim().split(' ');
    if (parts.length !== 2) {
      throw new httpError.UnauthorizedError();
    }
    const [scheme, token] = parts;
    if (/^Bearer$/i.test(scheme)) {
      try {
        //jwt.verify方法验证token是否有效
        await jwtService.verify(token, {
          complete: true,
        });
        // 解密token
        const tokenInfo: any = jwtService.decode(token);
        const decryptPhone = CryptoUtil.decryptStr(tokenInfo.phone);
        return decryptPhone;
      } catch (error) {
        console.info(error)
        throw new BusinessException(ResponseCode.NOT_LOGIN_ERROR);
      }
    }
  }
}
