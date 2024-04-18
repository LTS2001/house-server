import { Body, Controller, File, Get, Inject, Post, Put, Query } from '@midwayjs/core';
import { TenantService } from 'src/service/user/TenantService';
import { ResultUtils } from '@/common/ResultUtils';
import { JwtMiddleware } from '@/middleware/JwtMiddleware';
import { AuthUtil } from '@/utils/AuthUtil';
import { Tenant } from '@/entities/Tenant';
import { Context } from '@midwayjs/koa';
import { JwtService } from '@midwayjs/jwt';
import { UpdateTenantReq } from '@/dto/user/TenantDto';
import { ToolUtil } from '@/utils/ToolUtil';
import { GetTenantReq, LoginReq, UpdateTenantStatusReq } from '@/dto/user/AdminDto';

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
  async login(@Body() loginReq: LoginReq) {
    const {phone, password} = loginReq;
    // const flag = ValidateUtil.validatePhone(phone);
    // if (!flag) throw new BusinessException(ResponseCode.PARAMS_ERROR, '输入的手机号不正确！');
    const tenant = await this.tenantService.login(phone, password);
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

  /**
   * 管理员获取租客信息
   */
  @Post('/admin/get', {middleware: [JwtMiddleware]})
  async getTenantByAdmin(@Body() getTenantReq: GetTenantReq) {
    Object.keys(getTenantReq).forEach(key => {
      if (!getTenantReq[key] && getTenantReq[key] !== 'status' && getTenantReq[key] !== 0) {
        delete getTenantReq[key];
      }
    });
    return new ResultUtils().success(await this.tenantService.getTenantByAdmin(getTenantReq));
  }

  @Put('/admin', {middleware: [JwtMiddleware]})
  async updateTenantStatus(@Body() tenantReq: UpdateTenantStatusReq) {
    const {status, id} = tenantReq;
    return new ResultUtils().success(await this.tenantService.updateTenantStatus(id, status));
  }
}
