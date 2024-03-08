import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { UserTenant } from '@/entities/UserTenant';
import { UpdateUserReq } from '@/dto/user/tenant/UpdateUserReq';

@Provide()
export class TenantDao {
  @InjectEntityModel(UserTenant)
  private userTenantModel: Repository<UserTenant>;

  /**
   * 通过用户手机号获取用户信息
   * @param phone 手机号
   * @return UserTenant 实体对象
   */
  async getUserByPhone(phone: string) {
    return await this.userTenantModel.findOne({
      where: {phone}
    });
  }

  /**
   * 添加用户
   * @param phone 手机号
   * @return UserTenant 实体对象
   */
  async addUser(phone: string): Promise<UserTenant> {
    const userTenant = new UserTenant();
    userTenant.phone = phone;
    userTenant.name = '单身租客';
    userTenant.headImg = 'male.png';
    return await this.userTenantModel.save(userTenant);
  }

  /**
   * 更新用户头像
   * @param phone 用户手机号
   * @param imgUrl 图片url
   * @return UserTenant 实体对象
   */
  async updateUserHeadImg(phone: string, imgUrl: string) {
    const userTenant = await this.userTenantModel.findOne({
      where: {phone}
    });
    userTenant.headImg = imgUrl;
    return await this.userTenantModel.save(userTenant);
  }

  /**
   * 更新用户信息
   * @param phone 手机号
   * @param updateUserInfo 更新的用户信息
   */
  async updateUser(phone: string, updateUserInfo: UpdateUserReq) {
    const userTenant = await this.userTenantModel.findOne({
      where: {phone}
    });
    Object.keys(updateUserInfo).forEach(item => {
      userTenant[item] = updateUserInfo[item];
    });
    return await this.userTenantModel.save(userTenant);
  }
}