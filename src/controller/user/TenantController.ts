import { Body, Controller, Files, Get, Inject, Post, Put } from '@midwayjs/core';
import TenantService from 'src/service/user/TenantService';
import { ValidateUtil } from '@/utils/ValidateUtil';
import { BusinessException } from '@/exception/BusinessException';
import { ResponseCode } from '@/common/ResponseFormat';
import { ResultUtils } from '@/common/ResultUtils';
import { JwtMiddleware } from '@/middleware/JwtMiddleware';
import AuthUtil from '@/utils/AuthUtil';
import { UserTenant } from '@/entities/UserTenant';
import { Context } from '@midwayjs/koa';
import { JwtService } from '@midwayjs/jwt';
import { UpdateUserReq } from '@/dto/user/tenant/UpdateUserReq';

@Controller('/user/tenant')
export class TenantController {
  @Inject()
  ctx: Context;
  @Inject()
  jwtService: JwtService;
  @Inject()
  userTenantService: TenantService;

  /**
   * 登录
   * @param phone 手机
   */
  @Post('/login')
  async login(@Body('phone') phone: string) {
    const flag = ValidateUtil.validatePhone(phone);
    if (!flag) throw new BusinessException(ResponseCode.PARAMS_ERROR, '输入的手机号不正确！');
    const userTenant = await this.userTenantService.login(phone);
    return new ResultUtils().success(userTenant);
  }

  /**
   * 获取当前用户信息
   */
  @Get('/', {middleware: [JwtMiddleware]})
  async getUser() {
    const decryptPhone = await new AuthUtil().getUserFromToken(this.ctx, this.jwtService);
    const userTenant = await this.userTenantService.getUser(decryptPhone);
    return new ResultUtils().success<UserTenant>(userTenant);
  }

  /**
   * 更新用户头像
   */
  @Post('/headImg', {middleware: [JwtMiddleware]})
  async updateUserHeadImg(@Files() files: any) {
    const imgUrlArr = files[0].data?.split('\\');
    const imgUrl = imgUrlArr[imgUrlArr.length - 1];
    const {phone} = this.ctx.user;
    const url = await this.userTenantService.updateHeadImg(phone, imgUrl);
    return new ResultUtils().success<string>(url);
  }


  /**
   * 更新用户信息
   */
  @Put('/', {middleware: [JwtMiddleware]})
  async updateUser(@Body() updateUserReq: UpdateUserReq) {
    const {phone} = this.ctx.user;
    const userTenant = await this.userTenantService.updateUser(phone, updateUserReq);
    return new ResultUtils().success<UserTenant>(userTenant);
  }

  /**
   * 获取租客租赁的房屋
   */
  @Get('/lease', {middleware: [JwtMiddleware]})
  async getUserLeaseHouse() {
    const {id} = this.ctx.user;
    const leaseHouse = await this.userTenantService.getUserLeaseHouse(id);
    return new ResultUtils().success(leaseHouse);
  }
}
