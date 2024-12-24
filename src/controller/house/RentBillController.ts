import { ResultUtils } from '@/common/ResultUtils';
import {
  AddRentBillReq,
  GetRentBillByBillDateObjReq,
  GetRentBillByLandlordIdReq,
  GetRentBillByTenantIdReq,
} from '@/dto/house/RentBillDto';
import { JwtMiddleware } from '@/middleware/JwtMiddleware';
import { RentBillService } from '@/service/house/RentBillService';
import { Body, Controller, Get, Inject, Post, Query } from '@midwayjs/core';

@Controller('/rent_bill', { middleware: [JwtMiddleware] })
export class RentBillController {
  @Inject()
  private rentBillService: RentBillService;
  /**
   * 添加一个账单
   */
  @Post('/')
  async addRentBill(@Body() addRentBill: AddRentBillReq) {
    const { billDate } = addRentBill;
    addRentBill.billDate = billDate + '-01';
    return new ResultUtils().success(
      await this.rentBillService.addRentBill(addRentBill)
    );
  }

  /**
   * 查询一个账单（通过房东id）
   */
  @Get('/landlord_id')
  async getRentBillByLandlordId(@Query() landlord: GetRentBillByLandlordIdReq) {
    const { landlordId } = landlord;
    return new ResultUtils().success(
      await this.rentBillService.getRentBillByLandlordId(landlordId)
    );
  }

  /**
   * 查询一个账单（通过租客id）
   */
  @Get('/tenant_id')
  async getRentBillByTenantId(@Query() tenant: GetRentBillByTenantIdReq) {
    const { tenantId } = tenant;
    return new ResultUtils().success(
      await this.rentBillService.getRentBillByTenantId(tenantId)
    );
  }

  /**
   * 查询一个账单（通过账单年月）
   */
  @Get('/bill_date')
  async getRentBillByBillDate(
    @Query() billDateObj: GetRentBillByBillDateObjReq
  ) {
    billDateObj.billDate = billDateObj.billDate + '-01';
    return new ResultUtils().success(
      await this.rentBillService.getRentBillByBillDate(billDateObj)
    );
  }
}
