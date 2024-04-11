import { Inject, Provide } from '@midwayjs/core';
import { LeaseDao } from '@/dao/house/LeaseDao';
import { HouseLease } from '@/entities/HouseLease';
import { InitiateLeaseReq, UpdateLeaseReq } from '@/dto/house/LeaseDto';
import { BusinessException } from '@/exception/BusinessException';
import { ResponseCode } from '@/common/ResponseFormat';
import { TenantDao } from '@/dao/user/TenantDao';
import { HouseDao } from '@/dao/house/HouseDao';
import { AddressDao } from '@/dao/house/AddressDao';
import { LEASE_PENDING, LEASE_REFUND, LEASE_TRAVERSE } from '@/constant/leaseConstant';
import { House } from '@/entities/House';
import { HOUSE_FORRENT_RELEASED, HOUSE_LEASED } from '@/constant/houseConstant';
import { HouseService } from '@/service/house/HouseService';

@Provide()
export class LeaseService {
  @Inject()
  private leaseDao: LeaseDao;
  @Inject()
  private tenantDao: TenantDao;
  @Inject()
  private houseDao: HouseDao;
  @Inject()
  private addressDao: AddressDao;
  @Inject()
  private houseService: HouseService;

  /**
   * 发起租赁申请
   * @param leaseObj 租赁信息
   */
  async initiateLease(leaseObj: InitiateLeaseReq) {
    const {houseId, landlordId, tenantId} = leaseObj;
    // 检查该房屋是否已租赁
    const checkLease = await this.leaseDao.checkHouseLeaseStatus(houseId, landlordId, tenantId);
    if (checkLease?.status === LEASE_TRAVERSE) { // 租赁记录标志为（通过租赁），则抛出错误
      throw new BusinessException(ResponseCode.OPERATION_ERROR, '该房屋已被租赁！');
    } else if (!checkLease || checkLease.status === LEASE_REFUND) { // checkLease 为空则表示不存在或者是退租，则需要进行插入租赁记录操作
      const lease = new HouseLease();
      lease.houseId = houseId;
      lease.landlordId = landlordId;
      lease.tenantId = tenantId;
      return this.leaseDao.addLease(lease);
    } else { // 其他情况则表示该记录存在，可能是被驳回的\退租的，修改状态即可
      return this.leaseDao.updateLeaseStatus({landlordId, tenantId, houseId}, LEASE_PENDING);
    }
  }

  /**
   * 获取租赁记录状态
   * @param houseId 房屋id
   * @param tenantId 租客id
   */
  async getLeaseStatus(houseId: number, tenantId: number) {
    return await this.leaseDao.getLeaseStatus(houseId, tenantId);
  }

  /**
   * 更新租赁记录状态
   * @param updateObj 更新的对象
   */
  async updateLeaseStatus(updateObj: UpdateLeaseReq) {
    const {landlordId, tenantId, houseId, status} = updateObj;
    if (status === LEASE_TRAVERSE) { // 若是通过租赁，修改该房屋的状态
      const house = new House();
      house.status = HOUSE_LEASED;
      await this.houseDao.updateHouse(houseId, house);
    }
    return await this.leaseDao.updateLeaseStatus({landlordId, tenantId, houseId}, status);
  }


  /**
   * 获取租客申请租赁的记录（lease表待处理的选项）
   * @param landlordId 房东id
   */
  async getTenantLeasePendingTodoByLandlordId(landlordId: number) {
    const leaseList = await this.leaseDao.getTenantLeasePendingTodoByLandlordId(landlordId);
    // 查询租客信息
    const tenantList = await this.tenantDao.getTenantByIds(leaseList.map(l => l.tenantId));
    // 查询房屋信息
    const houseList = await this.houseDao.getHouseByHouseIds(leaseList.map(l => l.houseId));
    // 查询房屋地址信息
    const addressList = await this.addressDao.getHouseAddress(houseList.map(h => h.addressId));
    return leaseList.map((lease: HouseLease, idx: number) => {
      const tenant = tenantList.find(t => t.id === lease.tenantId);
      const house = houseList.find(h => h.id === lease.houseId);
      const address = addressList.find(a => a.id === house.addressId);
      return {
        houseId: house.id,
        houseName: house.name,
        address: address.provinceName + address.cityName + address.areaName + address.addressInfo,
        tenantId: tenant.id,
        tenantHeadImg: tenant.headImg,
        tenantName: tenant.name,
        tenantPhone: tenant.phone,
        landlordId,
        leaseDate: lease.updatedAt,
      };
    });
  }

  /**
   * 退租
   * @param leaseId
   */
  async refundLease(leaseId: number) {
    const lease = await this.leaseDao.updateLeaseStatusByLeaseId(leaseId, LEASE_REFUND);
    console.log(lease);
    const house = new House();
    // 房屋状态回到（待租已发布）的状态
    house.status = HOUSE_FORRENT_RELEASED;
    await this.houseDao.updateHouse(lease.houseId, house);
    return lease;
  }

  /**
   * 获取租客租房历史
   * @param tenantId
   */
  async getRefundLeaseHistory(tenantId: number) {
    const leaseList = await this.leaseDao.getLeaseByTenantId(tenantId);
    // 找出已经退租的租赁记录
    const refundLease = leaseList?.filter(l => l.status === LEASE_REFUND);
    const twoIdList = refundLease.map(refund => {
      const {houseId, landlordId} = refund;
      return {
        houseId,
        landlordId,
      };
    });
    const houseInfoList = await this.houseService.getHouseByTwoIdList(twoIdList);
    return twoIdList.map(t => {
      const houseInfo = houseInfoList.find(h => h.landlordId === t.landlordId && h.houseId === t.houseId);
      const refund = refundLease.find(r => r.landlordId === t.landlordId && r.houseId === t.houseId);
      const leaseId = refund.id;
      delete refund.id;
      return {
        ...houseInfo, ...refund, leaseId
      };
    });
  }
}