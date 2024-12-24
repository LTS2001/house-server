import { RentBillDao } from '@/dao/house/RentBillDao';
import {
  AddRentBillReq,
  GetRentBillByBillDateObjReq,
} from '@/dto/house/RentBillDto';
import { Inject, Provide } from '@midwayjs/core';

@Provide()
export class RentBillService {
  @Inject()
  private rentBillDao: RentBillDao;

  /**
   * 添加一个账单
   * @param rentBillObj 账单对象
   */
  async addRentBill(rentBillObj: AddRentBillReq) {
    return await this.rentBillDao.addRentBill(rentBillObj);
  }

  /**
   * 查询一个账单（通过房东id）
   * @param landlordId 房东id
   */
  async getRentBillByLandlordId(landlordId: number) {
    return await this.rentBillDao.getRentBillByLandlordId(landlordId);
  }

  /**
   * 查询一个账单（通过租客id）
   * @param tenantId 租客id
   */
  async getRentBillByTenantId(tenantId: number) {
    return await this.rentBillDao.getRentBillByTenantId(tenantId);
  }

  /**
   * 查询一个账单（通过账单年月）
   * @param billDate 账单日期
   */
  async getRentBillByBillDate(billDateObj: GetRentBillByBillDateObjReq) {
    const { houseId, tenantId, landlordId, billDate } = billDateObj;
    return await this.rentBillDao.getRentBillByBillDate({
      houseId,
      tenantId,
      landlordId,
      billDate,
    });
  }
}
