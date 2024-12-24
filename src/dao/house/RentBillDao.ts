import { AddRentBillReq } from '@/dto/house/RentBillDto';
import { RentBill } from '@/entities/RentBill';
import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';

@Provide()
export class RentBillDao {
  @InjectEntityModel(RentBill)
  private rentBillModel: Repository<RentBill>;

  /**
   * 添加一个账单
   * @param rentBillObj 账单对象
   */
  async addRentBill(rentBillObj: AddRentBillReq) {
    const rentBill = new RentBill();
    Reflect.ownKeys(rentBillObj).forEach(key => {
      rentBill[key] = rentBillObj[key];
    });
    return await this.rentBillModel.save(rentBill);
  }

  /**
   * 查询一个账单（通过房东id）
   * @param landlordId 房东id
   */
  async getRentBillByLandlordId(landlordId: number) {
    return await this.rentBillModel.find({
      where: { landlordId },
    });
  }

  /**
   * 查询一个账单（通过租客id）
   * @param tenantId 租客id
   */
  async getRentBillByTenantId(tenantId: number) {
    return await this.rentBillModel.find({
      where: { tenantId },
    });
  }

  /**
   * 查询一个账单（通过账单年月）
   * @param billDate 账单日期
   */
  async getRentBillByBillDate({
    houseId,
    tenantId,
    landlordId,
    billDate,
  }: {
    houseId: number;
    tenantId: number;
    landlordId: number;
    billDate: string;
  }) {
    return await this.rentBillModel.findOne({
      where: {
        houseId,
        tenantId,
        landlordId,
        billDate,
      },
    });
  }
}
