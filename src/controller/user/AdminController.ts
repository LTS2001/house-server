import { Body, Controller, Del, Get, Inject, Post, Put, Query } from '@midwayjs/core';
import { AddAdminReq, GetAdminReq, LoginReq, UpdateAdminReq, UpdateAdminSelfReq } from '@/dto/user/AdminDto';
import { AdminService } from '@/service/user/AdminService';
import { ResultUtils } from '@/common/ResultUtils';
import { Context } from '@midwayjs/koa';
import { Role } from '@/decorator/role';
import { UserAdminConstant } from '@/constant/userConstant';
import { CryptoUtil } from '@/utils/CryptoUtil';
import { JwtService } from '@midwayjs/jwt';
import { JwtMiddleware } from '@/middleware/JwtMiddleware';

@Controller('/admin')
export class AdminController {
  @Inject()
  ctx: Context;
  @Inject()
  adminService: AdminService;
  @Inject()
  private jwtService: JwtService;

  /**
   * 管理员登录
   * @param loginReq
   */
  @Post('/login')
  async login(@Body() loginReq: LoginReq) {
    const {phone, password} = loginReq;
    // 手机号校验
    // if (!ValidateUtil.validatePhone(phone)) {
    //   throw new BusinessException(ResponseCode.PARAMS_ERROR, '输入的手机号不正确！');
    // }
    const encryptPhone = CryptoUtil.encryptStr(phone);
    // 设置JWT响应头
    this.ctx.set('Token', `Bearer ${ this.jwtService.signSync({phone: encryptPhone}) }`);
    this.ctx.set('Access-Control-Expose-Headers', 'Token');
    return new ResultUtils().success(await this.adminService.login(phone, password));
  }

  /**
   * 添加管理员
   * @param addAdminReq
   */
  @Post('/', {middleware: [JwtMiddleware]})
  @Role(UserAdminConstant.SuperAdminRole)
  async addAdmin(@Body() addAdminReq: AddAdminReq) {
    // 校验手机号是否合法
    // if (!ValidateUtil.validatePhone(addAdminReq.phone)) {
    //   throw new BusinessException(ResponseCode.PARAMS_ERROR, '输入的手机号不正确！');
    // }
    const userId = await this.adminService.addAdmin(addAdminReq);
    return new ResultUtils().success({id: userId});
  }

  /**
   * 删除管理员
   * @param phone
   */
  @Del('/')
  async delAdmin(@Query('phone') phone: string) {
    // const flag = ValidateUtil.validatePhone(phone);
    // if (!flag) {
    //   throw new BusinessException(ResponseCode.PARAMS_ERROR, '输入的手机号不正确！');
    // }
    return new ResultUtils().success(await this.adminService.delAdmin(phone));
  }

  /**
   * 更新管理员
   * @param updateAdminReq
   */
  @Put('/', {middleware: [JwtMiddleware]})
  @Role(UserAdminConstant.SuperAdminRole)
  async updateAdmin(@Body() updateAdminReq: UpdateAdminReq) {
    // 校验手机号是否合法
    // if (!ValidateUtil.validatePhone(updateAdminReq.phone)) {
    //   throw new BusinessException(ResponseCode.PARAMS_ERROR, '输入的手机号不正确！');
    // }
    const userId = await this.adminService.updateAdmin(updateAdminReq);
    return new ResultUtils().success({id: userId});
  }

  @Put('/self', {middleware: [JwtMiddleware]})
  async updateAdminSelf(@Body() adminReq: UpdateAdminSelfReq) {
    return new ResultUtils().success(await this.adminService.updateAdmin(adminReq));
  }

  /**
   * 查询管理员
   * @param phone
   */
  @Get('/', {middleware: [JwtMiddleware]})
  async getAdmin() {
    const {phone} = this.ctx.user;
    return new ResultUtils().success(await this.adminService.getAdmin(phone));
  }

  /**
   * 超级管理员获取管理员信息
   */
  @Post('/list', {middleware: [JwtMiddleware]})
  async getAdminList(@Body() getAdminReq: GetAdminReq) {
    Object.keys(getAdminReq).forEach(key => {
      if (!getAdminReq[key] && getAdminReq[key] !== 'status' && getAdminReq[key] !== 0) {
        delete getAdminReq[key];
      }
    });
    return new ResultUtils().success(await this.adminService.getAdminList(getAdminReq));
  }
}





