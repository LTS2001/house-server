import { Body, Controller, Del, Get, Inject, Post, Put, Query } from '@midwayjs/core';
import { AddAdminReq, LoginReq, UpdateAdminReq } from '@/dto/user/AdminDto';
import { AdminService } from '@/service/user/AdminService';
import { BusinessException } from '@/exception/BusinessException';
import { ResponseCode } from '@/common/ResponseFormat';
import { ResultUtils } from '@/common/ResultUtils';
import { ValidateUtil } from '@/utils/ValidateUtil';
import { Context } from '@midwayjs/koa';
import { Role } from '@/decorator/role';
import { UserAdminConstant } from '@/constant/userConstant';
import { SessionMiddleware } from '@/middleware/SessionMiddleware';

@Controller('/admin')
export class AdminController {
  @Inject()
  ctx: Context;
  @Inject()
  adminService: AdminService;


  /**
   * 管理员登录
   * @param loginReq
   */
  @Post('/login')
  async login(@Body() loginReq: LoginReq) {
    const {phone, password} = loginReq;
    // 手机号校验
    if (!ValidateUtil.validatePhone(phone)) {
      throw new BusinessException(ResponseCode.PARAMS_ERROR, '输入的手机号不正确！');
    }
    // 密码校验
    if (!ValidateUtil.validatePassword(password)) {
      throw new BusinessException(ResponseCode.PARAMS_ERROR, '密码必须包含大小写字母和数字，且在6~18位之间！');
    }
    return new ResultUtils().success(await this.adminService.login(phone, password));
  }

  /**
   * 添加管理员
   * @param addAdminReq
   */
  @Post('/', {middleware: [SessionMiddleware]})
  @Role(UserAdminConstant.SuperAdminRole)
  async addAdmin(@Body() addAdminReq: AddAdminReq) {
    // 校验手机号是否合法
    if (!ValidateUtil.validatePhone(addAdminReq.phone)) {
      throw new BusinessException(ResponseCode.PARAMS_ERROR, '输入的手机号不正确！');
    }
    // 校验密码
    if (!ValidateUtil.validatePassword(addAdminReq.password)) {
      throw new BusinessException(ResponseCode.PARAMS_ERROR, '密码必须包含大小写字母和数字，且在6~18位之间！');
    }
    if (addAdminReq.password !== addAdminReq.checkPassword) {
      throw new BusinessException(ResponseCode.PARAMS_ERROR, '两次输入的密码不一致！');
    }
    const userId = await this.adminService.addAdmin(addAdminReq);
    return new ResultUtils().success({id: userId});
  }

  /**
   * 删除管理员
   * @param phone
   */
  @Del('/')
  async delAdmin(@Query('phone') phone: string) {
    const flag = ValidateUtil.validatePhone(phone);
    if (!flag) {
      throw new BusinessException(ResponseCode.PARAMS_ERROR, '输入的手机号不正确！');
    }
    return new ResultUtils().success(await this.adminService.delAdmin(phone));
  }

  /**
   * 更新管理员
   * @param updateAdminReq
   */
  @Put('/', {middleware: [SessionMiddleware]})
  @Role(UserAdminConstant.SuperAdminRole)
  async updateAdmin(@Body() updateAdminReq: UpdateAdminReq) {
    // 校验手机号是否合法
    if (!ValidateUtil.validatePhone(updateAdminReq.phone)) {
      throw new BusinessException(ResponseCode.PARAMS_ERROR, '输入的手机号不正确！');
    }
    // 校验密码
    if (!ValidateUtil.validatePassword(updateAdminReq.newPassword)) {
      throw new BusinessException(ResponseCode.PARAMS_ERROR, '密码必须包含大小写字母和数字，且在6~18位之间！');
    }
    if (updateAdminReq.newPassword !== updateAdminReq.checkPassword) {
      throw new BusinessException(ResponseCode.PARAMS_ERROR, '两次输入的密码不一致！');
    }
    const userId = await this.adminService.updateAdmin(updateAdminReq);
    return new ResultUtils().success({id: userId});
  }

  /**
   * 查询管理员
   * @param phone
   */
  @Get('/', {middleware: [SessionMiddleware]})
  async getAdmin(@Query('phone') phone: string) {
    const flag = ValidateUtil.validatePhone(phone);
    if (!flag) {
      throw new BusinessException(ResponseCode.PARAMS_ERROR, '输入的手机号不正确！');
    }
    return new ResultUtils().success(await this.adminService.getAdmin(phone));
  }
}





