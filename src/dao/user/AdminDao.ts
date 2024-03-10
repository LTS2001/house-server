import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { Admin } from '@/entities/Admin';

@Provide()
export class AdminDao {
  @InjectEntityModel(Admin)
  adminModel: Repository<Admin>;

  /**
   * 添加管理员
   * @param adminObj 管理员信息对象
   * @return Admin 实体对象
   */
  async addAdmin(adminObj: Admin) {
    const admin = new Admin();
    Object.keys(adminObj).forEach(key => {
      admin[key] = adminObj[key];
    });
    return await this.adminModel.save(admin);
  }

  /**
   * 删除管理员
   * @param phone 手机号
   */
  async delAdmin(phone: string) {
    const admin = await this.adminModel.findOne({where: {phone}});
    admin.status = 0;
    return await this.adminModel.save(admin);
  }

  /**
   * 更新管理员
   * @param phone 手机号
   * @param adminObj 管理员信息
   * @return Admin 实体对象
   */
  async updateAdmin(phone: string, adminObj: Admin) {
    const admin = await this.adminModel.findOne({where: {phone}});
    Object.keys(adminObj).forEach((key) => {
      admin[key] = adminObj[key];
    });
    return await this.adminModel.save(admin);
  }

  /**
   * 通过用户手机号获取用户信息
   * @param phone 手机号
   * @return UserAdmin 实体对象
   */
  async getAdminByPhone(phone: string) {
    return await this.adminModel.findOne({where: {phone}});
  }
}
