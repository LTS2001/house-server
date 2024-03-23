import { Body, Controller, Get, Inject, Post, Put, Query } from '@midwayjs/core';
import { JwtMiddleware } from '@/middleware/JwtMiddleware';
import { AddReportReq, UpdateReportReq } from '@/dto/house/ReportDto';
import { ReportService } from '@/service/house/ReportService';
import { Context } from '@midwayjs/koa';
import { ResultUtils } from '@/common/ResultUtils';

@Controller('/report')
export class ReportController {
  @Inject()
  private ctx: Context;
  @Inject()
  private reportService: ReportService;

  /**
   * 添加维修记录
   * @param addReportReq
   */
  @Post('/', {middleware: [JwtMiddleware]})
  async addReport(@Body() addReportReq: AddReportReq) {
    const {id} = this.ctx.user;
    return new ResultUtils().success(await this.reportService.addReport(addReportReq, id));
  }

  /**
   * 通过租客id查询房屋维修记录
   * @param tenantId
   */
  @Get('/tenant', {middleware: [JwtMiddleware]})
  async getReportByTenantId(@Query('tenantId') tenantId: number) {
    return new ResultUtils().success(await this.reportService.getReportByTenantId(tenantId));
  }

  /**
   * 通过房东id查询房屋维修记录
   * @param landlordId
   */
  @Get('/landlord', {middleware: [JwtMiddleware]})
  async getReportByLandlordId(@Query('landlordId') landlordId: number) {
    return new ResultUtils().success(await this.reportService.getReportByLandlordId(landlordId));
  }

  /**
   * 更新维修状态
   */
  @Put('/', {middleware: [JwtMiddleware]})
  async updateReportStatusById(@Body() updateObj: UpdateReportReq) {
    const {reportId, status} = updateObj;
    return new ResultUtils().success(await this.reportService.updateReportStatus(reportId, status));
  }
}