import { Provide } from '@midwayjs/core';
import { Repository } from 'typeorm';
import { HouseLease } from '@/entities/HouseLease';
import { InjectEntityModel } from '@midwayjs/orm';

@Provide()
export class LeaseDao {
  @InjectEntityModel(HouseLease)
  private houseLeaseModel: Repository<HouseLease>;

  /**
   * 添加租赁记录
   * @param leaseObj 租赁信息
   */
  async addLease(leaseObj: HouseLease) {
    const lease = new HouseLease();
    Object.keys(leaseObj).forEach(key => {
      lease[key] = leaseObj[key];
    });
    return await this.houseLeaseModel.save(lease);
  }

  /**
   * 获取租赁记录状态
   * @param houseId 房屋id
   * @param tenantId 租客id
   */
  async getLeaseStatus(houseId: number, tenantId: number) {
    return await this.houseLeaseModel.findOne({
      where: {houseId, tenantId}
    });
  }

  /**
   * 获取租赁记录
   * @param tenantId 租客id
   */
  async getLeaseByTenantId(tenantId: number) {
    return await this.houseLeaseModel.find({
      where: {tenantId}
    });
  }
}