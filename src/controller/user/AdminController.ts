import {Body, Controller, Del, Get, Inject, Post, Put, Query} from "@midwayjs/core";
import {LoginReq} from "../../dto/user/admin/LoginReq";
import {AddUserReq} from "../../dto/user/admin/AddUserReq";
import AdminService from "../../service/user/AdminService";
import {BusinessException} from "@/exception/BusinessException";
import {ResponseCode} from "@/common/ResponseFormat";
import {ResultUtils} from "@/common/ResultUtils";
import {UpdateUserReq} from "../../dto/user/admin/UpdateUserReq";
import {ValidateUtil} from "../../utils/ValidateUtil";
import {Context} from "@midwayjs/koa";
import {Role} from "../../decorator/role";
import {UserAdminConstant} from "../../constant/userConstant";
import {SessionMiddleware} from "../../middleware/SessionMiddleware";

@Controller('/user/admin')
export class AdminController {
  @Inject()
  ctx: Context;
  @Inject()
  userAdminService: AdminService;


  /**
   * 用户登录
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
    const id = await this.userAdminService.login(phone, password);
    return new ResultUtils().success({id});
  }

  /**
   * 添加用户
   * @param addUserReq
   */
  @Post('/', {middleware: [SessionMiddleware]})
  @Role(UserAdminConstant.SuperAdminRole)
  async addUser(@Body() addUserReq: AddUserReq) {
    // 校验手机号是否合法
    if (!ValidateUtil.validatePhone(addUserReq.phone)) {
      throw new BusinessException(ResponseCode.PARAMS_ERROR, '输入的手机号不正确！');
    }
    // 校验密码
    if (!ValidateUtil.validatePassword(addUserReq.password)) {
      throw new BusinessException(ResponseCode.PARAMS_ERROR, "密码必须包含大小写字母和数字，且在6~18位之间！");
    }
    if (addUserReq.password !== addUserReq.checkPassword) {
      throw new BusinessException(ResponseCode.PARAMS_ERROR, '两次输入的密码不一致！');
    }
    // 剔除checkPassword属性
    const {checkPassword, ...addUserObj} = addUserReq;
    const userId = await this.userAdminService.addUser(addUserObj);
    return new ResultUtils().success({id: userId});
  }

  /**
   * 删除用户
   * @param phone
   */
  @Del('/')
  async delUser(@Query('phone') phone: string) {
    const flag = ValidateUtil.validatePhone(phone);
    if (!flag) {
      throw new BusinessException(ResponseCode.PARAMS_ERROR, '输入的手机号不正确！');
    }
    await this.userAdminService.delUser(phone);
    return new ResultUtils().success(null)
  }

  /**
   * 更新用户
   * @param updateUserReq
   */
  @Put('/', {middleware: [SessionMiddleware]})
  @Role(UserAdminConstant.SuperAdminRole)
  async updateUser(@Body() updateUserReq: UpdateUserReq) {
    // 校验手机号是否合法
    if (!ValidateUtil.validatePhone(updateUserReq.phone)) {
      throw new BusinessException(ResponseCode.PARAMS_ERROR, '输入的手机号不正确！');
    }
    // 校验密码
    if (!ValidateUtil.validatePassword(updateUserReq.newPassword)) {
      throw new BusinessException(ResponseCode.PARAMS_ERROR, '密码必须包含大小写字母和数字，且在6~18位之间！');
    }
    if (updateUserReq.newPassword !== updateUserReq.checkPassword) {
      throw new BusinessException(ResponseCode.PARAMS_ERROR, '两次输入的密码不一致！');
    }
    const {checkPassword, ...updateUserObj} = updateUserReq;
    const userId = await this.userAdminService.updateUser(updateUserObj);
    return new ResultUtils().success({id: userId});
  }

  /**
   * 查询用户
   * @param phone
   */
  @Get('/', {middleware: [SessionMiddleware]})
  async getUser(@Query('phone') phone: string) {
    const flag = ValidateUtil.validatePhone(phone);
    if (!flag) {
      throw new BusinessException(ResponseCode.PARAMS_ERROR, '输入的手机号不正确！');
    }
    const userAdmin = await this.userAdminService.getUser(phone);
    return new ResultUtils().success(userAdmin);
  }
}





