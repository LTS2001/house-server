import { Body, Controller, File, Get, Inject, Post, Put, Query } from '@midwayjs/core';
import { TenantService } from 'src/service/user/TenantService';
import { ValidateUtil } from '@/utils/ValidateUtil';
import { BusinessException } from '@/exception/BusinessException';
import { ResponseCode } from '@/common/ResponseFormat';
import { ResultUtils } from '@/common/ResultUtils';
import { JwtMiddleware } from '@/middleware/JwtMiddleware';
import { AuthUtil } from '@/utils/AuthUtil';
import { Tenant } from '@/entities/Tenant';
import { Context } from '@midwayjs/koa';
import { JwtService } from '@midwayjs/jwt';
import { UpdateTenantReq } from '@/dto/user/TenantDto';
import { ToolUtil } from '@/utils/ToolUtil';

@Controller('/tenant')
export class TenantController {
  @Inject()
  ctx: Context;
  @Inject()
  jwtService: JwtService;
  @Inject()
  tenantService: TenantService;

  /**
   * 登录
   * @param phone 手机
   */
  @Post('/login')
  async login(@Body('phone') phone: string) {
    const flag = ValidateUtil.validatePhone(phone);
    if (!flag) throw new BusinessException(ResponseCode.PARAMS_ERROR, '输入的手机号不正确！');
    const tenant = await this.tenantService.login(phone);
    return new ResultUtils().success(tenant);
  }

  /**
   * 获取当前租客信息
   */
  @Get('/', {middleware: [JwtMiddleware]})
  async getTenant() {
    const decryptPhone = await new AuthUtil().getUserFromToken(this.ctx, this.jwtService);
    const tenant = await this.tenantService.getTenant(decryptPhone);
    return new ResultUtils().success<Tenant>(tenant);
  }

  /**
   * 更新租客信息
   */
  @Put('/', {middleware: [JwtMiddleware]})
  async updateUser(@Body() updateUserReq: UpdateTenantReq) {
    const {phone} = this.ctx.user;
    const tenant = await this.tenantService.updateTenant(phone, updateUserReq);
    return new ResultUtils().success<Tenant>(tenant);
  }

  /**
   * 获取租客租赁的房屋
   */
  @Get('/lease', {middleware: [JwtMiddleware]})
  async getUserLeaseHouse(@Query('tenantId') tenantId: number) {
    const leaseHouse = await this.tenantService.getUserLeaseHouse(tenantId);
    return new ResultUtils().success(leaseHouse);
  }

  /**
   * 更新租客头像
   */
  @Post('/headImg', {middleware: [JwtMiddleware]})
  async updateTenantHeadImg(@File() file: any) {
    const imgUrlArr = file.data?.split('\\');
    const imgUrl = imgUrlArr[imgUrlArr.length - 1];
    const {phone} = this.ctx.user;
    const url = await this.tenantService.updateTenantHeadImg(phone, imgUrl);
    return new ResultUtils().success<string>(url);
  }

  /**
   * 通过id列表获取租客信息
   */
  @Get('/list', {middleware: [JwtMiddleware]})
  async getTenantByIdList(@Query('tenantIdList') tenantIdList: string) {
    const ids = ToolUtil.splitIdList(tenantIdList);
    return new ResultUtils().success(await this.tenantService.getTenantByIdList(ids));
  }
}
