import { AdminDao } from '@/dao/user/AdminDao';
import { Inject, Provide } from '@midwayjs/core';
import { BusinessException } from '@/exception/BusinessException';
import { ResponseCode } from '@/common/ResponseFormat';
import { RedisService } from '@midwayjs/redis';
import { Admin } from '@/entities/Admin';
import { AddAdminReq, GetAdminReq, UpdateAdminReq, UpdateAdminSelfReq } from '@/dto/user/AdminDto';

/**
 * user_admin处理逻辑
 */
@Provide()
export class AdminService {
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
    if (admin.password !== password) {
      throw new BusinessException(ResponseCode.PARAMS_ERROR, '密码错误！');
    }
    if (admin.status !== 1) {
      throw new BusinessException(ResponseCode.FORBIDDEN_ERROR, '该账号异常！');
    }
    // 用户信息存入redis
    await this.redisService.set(phone, JSON.stringify(admin));
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

    const admin = new Admin();
    Object.keys(adminObj).forEach(key => {
      admin[key] = adminObj[key];
    });
    const {phone} = adminObj;
    admin.password = phone.substring(phone.length - 6);

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
  async updateAdmin(adminObj: UpdateAdminReq | UpdateAdminSelfReq) {
    const {id} = adminObj;
    // 检查用户是否存在
    const checkAdmin = await this.adminDao.getAdminById(id);
    if (!checkAdmin) {
      throw new BusinessException(ResponseCode.PARAMS_ERROR, '该手机号不存在！');
    }
    const admin = new Admin();
    Object.keys(adminObj).forEach(key => {
      if (adminObj[key]) {
        admin[key] = adminObj[key];
      }
    });
    return await this.adminDao.updateAdmin(id, admin);
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

  async getAdminList(getAdminReq: GetAdminReq) {
    return await this.adminDao.getAdminList(getAdminReq);
  }
}
