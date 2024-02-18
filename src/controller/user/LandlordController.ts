import {Body, Controller, Files, Get, Inject, Post, Put} from "@midwayjs/core";
import {ValidateUtil} from "../../utils/ValidateUtil";
import {BusinessException} from "../../exception/BusinessException";
import {ResponseCode} from "../../common/ResponseFormat";
import LandlordService from "../../service/user/LandlordService";
import {ResultUtils} from "../../common/ResultUtils";
import {Context} from "@midwayjs/koa";
import {UserLandlord} from "../../entities/UserLandlord";
import {JwtMiddleware} from "../../middleware/JwtMiddleware";
import {JwtService} from "@midwayjs/jwt";
import AuthUtil from "../../utils/AuthUtil";
import {UpdateUserReq} from "../../dto/user/landlord/UpdateUserReq";

@Controller('/user/landlord')
export class LandlordController {
  @Inject()
  ctx: Context;
  @Inject()
  jwtService: JwtService;
  @Inject()
  userLandlordService: LandlordService;

  /**
   * 登录
   * @param phone
   */
  @Post('/login')
  async login(@Body('phone') phone: string) {
    const flag = ValidateUtil.validatePhone(phone);
    if (!flag) throw new BusinessException(ResponseCode.PARAMS_ERROR, '输入的手机号不正确！');
    const userLandlord = await this.userLandlordService.login(phone);
    return new ResultUtils().success(userLandlord);
  }

  /**
   * 获取当前用户信息
   */
  @Get('/', {middleware: [JwtMiddleware]})
  async getUser() {
    const decryptPhone = await new AuthUtil().getUserFromToken(this.ctx, this.jwtService);
    const userLandlord = await this.userLandlordService.getUser(decryptPhone);
    return new ResultUtils().success<UserLandlord>(userLandlord);
  }

  /**
   * 更新用户信息
   */
  @Put('/', {middleware: [JwtMiddleware]})
  async updateUser(@Body() updateUserReq: UpdateUserReq) {
    const {phone} = this.ctx.user;
    const userLandlord = await this.userLandlordService.updateUser(phone, updateUserReq);
    return new ResultUtils().success<UserLandlord>(userLandlord);
  }

  /**
   * 更新用户头像
   */
  @Post('/headImg', {middleware: [JwtMiddleware]})
  async updateUserHeadImg(@Files() files: any) {
    const imgUrlArr = files[0].data?.split('\\');
    const imgUrl = imgUrlArr[imgUrlArr.length - 1];
    const {phone} = this.ctx.user;
    const url = await this.userLandlordService.updateHeadImg(phone, imgUrl);
    return new ResultUtils().success<string>(url);
  }
}
