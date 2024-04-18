import { Provide } from '@midwayjs/core';
import { Repository } from 'typeorm';
import { HouseLease } from '@/entities/HouseLease';
import { InjectEntityModel } from '@midwayjs/orm';
import { LEASE_PENDING, LEASE_REJECT, LEASE_TRAVERSE } from '@/constant/leaseConstant';

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
      where: {houseId, tenantId},
      order: {
        updatedAt: 'desc'
      }
    });
  }

  /**
   * 检查房屋的租赁状态
   * @param houseId 房屋id
   * @param landlordId 房东id
   */
  async checkHouseLeaseStatus(houseId: number, landlordId: number, tenantId: number) {
    return await this.houseLeaseModel.findOne({
      where: {houseId, landlordId, tenantId},
      order: {
        updatedAt: 'desc'
      }
    });
  }

  /**
   * 通过房东id获取已租赁信息
   */
  async getLeaseByLandlordId(landlordId: number) {
    return await this.houseLeaseModel.find({
      where: {landlordId, status: LEASE_TRAVERSE}
    });
  }

  /**
   * 获取租客申请租赁的记录（lease表待处理的选项）
   */
  async getTenantLeasePendingTodoByLandlordId(landlordId: number) {
    return await this.houseLeaseModel.find({
      where: {landlordId, status: LEASE_PENDING}
    });
  }

  /**
   * 更新租赁记录的status
   * @param condition 条件
   * @param status 状态
   */
  async updateLeaseStatus(condition: { landlordId: number, tenantId: number, houseId: number }, status: number) {
    const {landlordId, tenantId, houseId} = condition;
    const lease = await this.houseLeaseModel.findOne({
      where: {landlordId, tenantId, houseId},
      order: {
        updatedAt: 'desc'
      }
    });
    lease.status = status;
    return await this.houseLeaseModel.save(lease);
  }

  /**
   * 驳回租赁记录
   */
  async rejectLease(houseId: number) {
    const leaseList = await this.houseLeaseModel.find({
      where: {houseId, status: LEASE_PENDING},
    });
    leaseList.forEach(lease => {
      lease.status = LEASE_REJECT;
    });
    return await this.houseLeaseModel.save(leaseList);
  }

  /**
   * 通过租赁id更新租赁状态
   * @param leaseId 租赁id
   * @param status 租赁状态
   */
  async updateLeaseStatusByLeaseId(leaseId: number, status: number) {
    const lease = await this.houseLeaseModel.findOne({
      where: {id: leaseId}
    });
    lease.status = status;
    return await this.houseLeaseModel.save(lease);
  }

  /**
   * 通过租客id获取租赁(所有状态)
   * @param tenantId
   */
  async getLeaseByTenantId(tenantId: number) {
    return await this.houseLeaseModel.find({
      where: {tenantId},
      order: {updatedAt: 'desc'}
    });
  }

  async getLeaseByHouseId(houseId: number) {
    return await this.houseLeaseModel.findOne({
      where: {houseId, status: LEASE_TRAVERSE}
    });
  }
}