import { Body, Controller, Get, Inject, Post, Query } from '@midwayjs/core';
import { JwtMiddleware } from '@/middleware/JwtMiddleware';
import { AddLeaseReq, GetLeaseReq } from '@/dto/house/LeaseDto';
import { LeaseService } from '@/service/house/LeaseService';
import { ResultUtils } from '@/common/ResultUtils';

@Controller('/lease')
export class LeaseController {
  @Inject()
  private leaseService: LeaseService;

  /**
   * 增加租赁申请记录
   * @param addLeaseReq
   */
  @Post('/', {middleware: [JwtMiddleware]})
  async addLease(@Body() addLeaseReq: AddLeaseReq) {
    return new ResultUtils().success(await this.leaseService.addLease(addLeaseReq));
  }

  /**
   * 获取租赁记录状态
   * @param getLeaseReq
   */
  @Get('/')
  async getLeaseStatus(@Query() getLeaseReq: GetLeaseReq) {
    const {houseId, tenantId} = getLeaseReq;
    return new ResultUtils().success(await this.leaseService.getLeaseStatus(houseId, tenantId));
  }
}