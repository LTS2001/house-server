import { AdminDao } from '@/dao/user/AdminDao';
import { Inject, Provide } from '@midwayjs/core';
import { BusinessException } from '@/exception/BusinessException';
import { ResponseCode } from '@/common/ResponseFormat';
import { CryptoUtil } from '@/utils/CryptoUtil';
import { Context } from '@midwayjs/koa';
import { SESSION_KEY } from '@/constant/userConstant';
import { RedisService } from '@midwayjs/redis';
import { Admin } from '@/entities/Admin';
import { AddAdminReq, UpdateAdminReq } from '@/dto/user/AdminDto';

/**
 * user_admin处理逻辑
 */
@Provide()
export class AdminService {
  @Inject()
  private ctx: Context;
  @Inject()
  private adminDao: AdminDao;
  @Inject()
  private redisService: RedisService;

  /**
   * 用户登录
   * @param phone 手机号
   * @param password 密码
   */
  async login(phone: string, password: string) {
    // 查询用户
    const admin = await this.adminDao.getAdminByPhone(phone);
    // 用户不存在
    if (!admin) {
      throw new BusinessException(ResponseCode.PARAMS_ERROR, '该手机号不存在！');
    }
    // 校验用户密码
    const decryptPassword = CryptoUtil.decryptStr(admin.password);
    if (decryptPassword !== password) {
      throw new BusinessException(ResponseCode.PARAMS_ERROR, '密码错误！');
    }
    this.ctx.session[SESSION_KEY] = CryptoUtil.encryptStr(phone);
    // 将user的信息存入redis数据库中，加密后的手机号则作为key
    await this.redisService.set(this.ctx.session[SESSION_KEY], JSON.stringify(admin));
    return admin;
  }

  /**
   * 添加管理员
   * @param adminObj 用户信息对象
   * @return userId 用户id
   */
  async addAdmin(adminObj: AddAdminReq): Promise<number> {
    // 检查该用户是否存在
    const checkAdmin = await this.adminDao.getAdminByPhone(adminObj.phone);
    if (checkAdmin) {
      throw new BusinessException(ResponseCode.PARAMS_ERROR, '该手机号已经存在！');
    }
    // 密码加密
    adminObj.password = CryptoUtil.encryptStr(adminObj.password);
    const {name, phone, password, headImg, remark} = adminObj;
    const admin = new Admin();
    admin.name = name;
    admin.phone = phone;
    admin.password = password;
    admin.headImg = headImg;
    admin.remark = remark;
    const userAdmin = await this.adminDao.addAdmin(admin);
    if (!userAdmin) {
      throw new BusinessException(ResponseCode.SYSTEM_ERROR, '添加失败，请稍后重试！');
    }
    return userAdmin.id;
  }

  /**
   * 删除管理员
   * @param phone 手机号
   */
  async delAdmin(phone: string) {
    return await this.adminDao.delAdmin(phone);
  }

  /**
   * 更新管理员
   * @param adminObj 管理员信息
   */
  async updateAdmin(adminObj: UpdateAdminReq) {
    const {phone, name, headImg, remark, newPassword} = adminObj;
    // 检查用户是否存在
    const checkAdmin = await this.adminDao.getAdminByPhone(phone);
    if (!checkAdmin) {
      throw new BusinessException(ResponseCode.PARAMS_ERROR, '该手机号不存在！');
    }
    // 若更改了密码，检验新旧密码是否相同
    if (CryptoUtil.decryptStr(checkAdmin.password) === newPassword) {
      throw new BusinessException(ResponseCode.PARAMS_ERROR, '新旧密码相同！');
    }
    let passwordEncrypt: string;
    if (newPassword) {
      // 密码加密
      passwordEncrypt = CryptoUtil.encryptStr(newPassword);
    }

    const admin = new Admin();
    if (passwordEncrypt) admin.password = passwordEncrypt;
    if (name) admin.name = name;
    if (headImg) admin.headImg = headImg;
    if (remark) admin.remark = remark;

    return await this.adminDao.updateAdmin(phone, admin);
  }

  /**
   * 获取管理员信息
   * @param phone 手机号
   * @return Admin 实体对象
   */
  async getAdmin(phone: string) {
    const admin = await this.adminDao.getAdminByPhone(phone);
    return {...admin, password: ''};
  }
}
