import { Body, Controller, Inject, Post } from '@midwayjs/core';
import { JwtMiddleware } from '@/middleware/JwtMiddleware';
import { AddReportReq } from '@/dto/house/ReportDto';
import { ReportService } from '@/service/house/ReportService';
import { Context } from '@midwayjs/koa';
import { ResultUtils } from '@/common/ResultUtils';

@Controller('/maintenance')
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
}