import { Body, Controller, Get, Inject, Post, Put, Query } from '@midwayjs/core';
import { JwtMiddleware } from '@/middleware/JwtMiddleware';
import { GetLeaseReq, InitiateLeaseReq, UpdateLeaseReq } from '@/dto/house/LeaseDto';
import { LeaseService } from '@/service/house/LeaseService';
import { ResultUtils } from '@/common/ResultUtils';
import { Context } from '@midwayjs/koa';

@Controller('/lease')
export class LeaseController {
  @Inject()
  private ctx: Context;
  @Inject()
  private leaseService: LeaseService;

  /**
   * 发起租赁申请
   * @param initiateLeaseReq
   */
  @Post('/', {middleware: [JwtMiddleware]})
  async initiateLease(@Body() initiate: InitiateLeaseReq) {
    return new ResultUtils().success(await this.leaseService.initiateLease(initiate));
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

  /**
   * 更新租赁记录状态
   */
  @Put('/', {middleware: [JwtMiddleware]})
  async updateLeaseStatus(@Body() updateLeaseReq: UpdateLeaseReq) {
    return new ResultUtils().success(await this.leaseService.updateLeaseStatus(updateLeaseReq));
  }


  /**
   * 获取租客申请租赁的记录（lease表待处理的选项）
   */
  @Get('/pending', {middleware: [JwtMiddleware]})
  async getTenantLeasePendingTodoByLandlordId() {
    const landlord = this.ctx.user;
    return new ResultUtils().success(await this.leaseService.getTenantLeasePendingTodoByLandlordId(landlord.id));
  }

  /**
   * 租客退租
   */
  @Put('/refund', {middleware: [JwtMiddleware]})
  async refundLease(@Body('leaseId') leaseId: number) {
    return new ResultUtils().success(await this.leaseService.refundLease(leaseId));
  }

  /**
   * 获取租房历史
   */
  @Get('/refund', {middleware: [JwtMiddleware]})
  async getRefundLeaseHistory(@Query('tenantId') tenantId: number) {
    return new ResultUtils().success(await this.leaseService.getRefundLeaseHistory(tenantId));
  }

  @Get('/tenant', {middleware: [JwtMiddleware]})
  async getLeaseTenantByHouseId(@Query('houseId') houseId: number) {
    return new ResultUtils().success(await this.leaseService.getLeaseTenantByHouseId(houseId))
  }
}