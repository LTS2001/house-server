import { Inject, Provide } from '@midwayjs/core';
import { LeaseDao } from '@/dao/link/LeaseDao';

@Provide()
export class LeaseService {
  @Inject()
  private leaseDao: LeaseDao;

  /**
   * 添加租赁记录
   * @param houseId 房屋id
   * @param tenantId 租客id
   */
  async addLease(houseId: number, tenantId: number) {
    return this.leaseDao.addLease(houseId, tenantId);
  }

  /**
   * 获取租赁记录状态
   * @param houseId 房屋id
   * @param tenantId 租客id
   */
  async getLeaseStatus(houseId: number, tenantId: number) {
    return await this.leaseDao.getLeaseStatus(houseId, tenantId);
  }
}