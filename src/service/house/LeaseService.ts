import { Inject, Provide } from '@midwayjs/core';
import { LeaseDao } from '@/dao/house/LeaseDao';
import { HouseLease } from '@/entities/HouseLease';
import { AddLeaseReq } from '@/dto/house/LeaseDto';

@Provide()
export class LeaseService {
  @Inject()
  private leaseDao: LeaseDao;

  /**
   * 添加租赁记录
   * @param leaseObj 租赁信息
   */
  async addLease(leaseObj: AddLeaseReq) {
    const {houseId, landlordId, tenantId} = leaseObj;
    const lease = new HouseLease();
    lease.houseId = houseId;
    lease.landlordId = landlordId;
    lease.tenantId = tenantId;
    return this.leaseDao.addLease(lease);
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