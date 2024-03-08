import { Provide } from '@midwayjs/core';
import { Repository } from 'typeorm';
import { LinkLease } from '@/entities/LinkLease';
import { InjectEntityModel } from '@midwayjs/orm';

@Provide()
export class LeaseDao {
  @InjectEntityModel(LinkLease)
  private leaseModel: Repository<LinkLease>;

  /**
   * 添加租赁记录
   * @param houseId 房屋id
   * @param tenantId 租客id
   */
  async addLease(houseId: number, tenantId: number) {
    const lease = new LinkLease();
    lease.houseId = houseId;
    lease.tenantId = tenantId;
    return await this.leaseModel.save(lease);
  }

  /**
   * 获取租赁记录状态
   * @param houseId 房屋id
   * @param tenantId 租客id
   */
  async getLeaseStatus(houseId: number, tenantId: number) {
    return await this.leaseModel.findOne({
      where: {houseId, tenantId}
    });
  }

  /**
   * 获取租赁记录
   * @param tenantId 租客id
   */
  async getLeaseByTenantId(tenantId: number) {
    return await this.leaseModel.find({
      where: {tenantId}
    });
  }
}