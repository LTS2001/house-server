import {AdminDao} from "../../dao/user/AdminDao";
import {Inject, Provide} from "@midwayjs/core";
import {BusinessException} from "../../exception/BusinessException";
import {ResponseCode} from "../../common/ResponseFormat";
import {CryptoUtil} from "../../utils/CryptoUtil";
import {IUserAdmin} from "../../typings/user/admin";
import {Context} from "@midwayjs/koa";
import {SESSION_KEY} from "../../constant/userConstant";
import {RedisService} from "@midwayjs/redis";

/**
 * user_admin处理逻辑
 */
@Provide()
export default class AdminService {
  @Inject()
  private ctx: Context;
  @Inject()
  private userAdminDao: AdminDao;
  @Inject()
  private redisService: RedisService;

  /**
   * 用户登录
   * @param phone 手机号
   * @param password 密码
   * @return userId 用户id
   */
  async login(phone: string, password: string) {
    // 查询用户
    const userAdmin = await this.userAdminDao.getUserByPhone(phone);
    // 用户不存在
    if (!userAdmin) {
      throw new BusinessException(ResponseCode.PARAMS_ERROR, '该手机号不存在！');
    }
    // 校验用户密码
    const decryptPassword = CryptoUtil.decryptStr(userAdmin.password);
    if (decryptPassword !== password) {
      throw new BusinessException(ResponseCode.PARAMS_ERROR, '密码错误！');
    }
    this.ctx.session[SESSION_KEY] = CryptoUtil.encryptStr(phone);
    // 将user的信息存入redis数据库中，加密后的手机号则作为key
    await this.redisService.set(this.ctx.session[SESSION_KEY], JSON.stringify(userAdmin));
    return userAdmin.id;
  }

  /**
   * 添加用户
   * @param addUserObj 用户信息对象
   * @return userId 用户id
   */
  async addUser(addUserObj: IUserAdmin.AddUserObj): Promise<number> {
    // 检查该用户是否存在
    const checkUser = await this.userAdminDao.getUserByPhone(addUserObj.phone);
    if (checkUser) {
      throw new BusinessException(ResponseCode.PARAMS_ERROR, '该手机号已经存在！');
    }
    // 密码加密
    addUserObj.password = CryptoUtil.encryptStr(addUserObj.password);
    const userAdmin = await this.userAdminDao.addUser(addUserObj);
    if (!userAdmin) {
      throw new BusinessException(ResponseCode.SYSTEM_ERROR, '添加失败，请稍后重试！');
    }
    return userAdmin.id;
  }

  /**
   * 删除用户
   * @param phone 手机号
   */
  async delUser(phone: string) {
    const {affected} = await this.userAdminDao.delUser(phone);
    if (affected === 0) {
      throw new BusinessException(ResponseCode.PARAMS_ERROR, '用户不存在！');
    }
  }

  /**
   * 更新用户
   * @param updateUserObj 更新内容对象
   * @return userId 用户id
   */
  async updateUser(updateUserObj: IUserAdmin.UpdateUserObj): Promise<number> {
    // 检查用户是否存在
    const checkUser = await this.userAdminDao.getUserByPhone(updateUserObj.phone);
    if (!checkUser) {
      throw new BusinessException(ResponseCode.PARAMS_ERROR, '该手机号不存在！');
    }
    // 若更改了密码，检验新旧密码是否相同
    if (CryptoUtil.decryptStr(checkUser.password) === updateUserObj.newPassword) {
      throw new BusinessException(ResponseCode.PARAMS_ERROR, '新旧密码相同！');
    }
    // 密码加密
    const password = CryptoUtil.encryptStr(updateUserObj.newPassword);
    const {newPassword, ...newUpdateUserObj} = updateUserObj;
    const updateUserResult = await this.userAdminDao.updateUser({password, ...newUpdateUserObj});
    return updateUserResult.id;
  }

  /**
   * 获取用户信息
   * @param phone 手机号
   * @return UserAdmin 实体对象
   */
  async getUser(phone: string) {
    const userAdmin = await this.userAdminDao.getUserByPhone(phone);
    if (!userAdmin) {
      throw new BusinessException(ResponseCode.PARAMS_ERROR, '该用户信息不存在！')
    }
    return {...userAdmin, password: ''}
  }
}
