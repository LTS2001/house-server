import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { Tenant } from '@/entities/Tenant';

@Provide()
export class TenantDao {
  @InjectEntityModel(Tenant)
  private tenantModel: Repository<Tenant>;

  /**
   * 通过用户手机号获取用户信息
   * @param phone 手机号
   * @return Tenant 实体对象
   */
  async getTenantByPhone(phone: string) {
    return await this.tenantModel.findOne({
      where: {phone}
    });
  }

  /**
   * 添加用户
   * @param phone 手机号
   * @return Tenant 实体对象
   */
  async addTenant(tenantObj: Tenant): Promise<Tenant> {
    const tenant = new Tenant();
    Object.keys(tenantObj).forEach(key => {
      tenant[key] = tenantObj[key];
    });
    return await this.tenantModel.save(tenant);
  }

  /**
   * 更新租客头像
   * @param phone 用户手机号
   * @param imgUrl 图片url
   * @return Tenant 实体对象
   */
  async updateTenantHeadImg(phone: string, imgUrl: string) {
    const tenant = await this.tenantModel.findOne({
      where: {phone}
    });
    tenant.headImg = imgUrl;
    return await this.tenantModel.save(tenant);
  }

  /**
   * 更新租客信息
   * @param phone 手机号
   * @param updateTenant 更新的租客信息
   * @return Tenant
   */
  async updateTenant(phone: string, updateTenant: Tenant) {
    const tenant = await this.tenantModel.findOne({
      where: {phone}
    });
    Object.keys(updateTenant).forEach(item => {
      tenant[item] = updateTenant[item];
    });
    return await this.tenantModel.save(tenant);
  }
}