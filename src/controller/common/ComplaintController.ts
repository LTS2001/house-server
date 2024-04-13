import { Body, Controller, Get, Inject, Post, Query } from '@midwayjs/core';
import { JwtMiddleware } from '@/middleware/JwtMiddleware';
import { AddComplaintReq, GetComplaintReq } from '@/dto/common/ComplaintDto';
import { ResultUtils } from '@/common/ResultUtils';
import { ComplaintService } from '@/service/common/ComplaintService';

@Controller('/complaint', {middleware: [JwtMiddleware]})
export class ComplaintController {
  @Inject()
  private complaintService: ComplaintService;

  @Post('/')
  async addComplaint(@Body() complaintReq: AddComplaintReq) {
    return new ResultUtils().success(await this.complaintService.addComplaint(complaintReq));
  }

  @Get('/')
  async getReportByTenantId(@Query() complaintReq: GetComplaintReq) {
    const {complaintId, identity} = complaintReq;
    return new ResultUtils().success(await this.complaintService.getComplaint(complaintId, identity));
  }
}