import { Body, Controller, Get, Inject, Post, Put, Query } from '@midwayjs/core';
import { JwtMiddleware } from '@/middleware/JwtMiddleware';
import { AddComplaintReq, GetComplaintReq } from '@/dto/common/ComplaintDto';
import { ResultUtils } from '@/common/ResultUtils';
import { ComplaintService } from '@/service/common/ComplaintService';
import { GetComplaintAdminReq, UpdateComplaintAdminReq } from '@/dto/user/AdminDto';

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

  /**
   * 管理员获取投诉信息
   */
  @Post('/admin/get', {middleware: [JwtMiddleware]})
  async getComplaintByAdmin(@Body() getComplaintReq: GetComplaintAdminReq) {
    Object.keys(getComplaintReq).forEach(key => {
      if (!getComplaintReq[key] && getComplaintReq[key] !== 'status' && getComplaintReq[key] !== 0) {
        delete getComplaintReq[key];
      }
    });
    return new ResultUtils().success(await this.complaintService.getComplainByAdmin(getComplaintReq));
  }

  @Put('/admin', {middleware: [JwtMiddleware]})
  async updateComplaintByAdmin(@Body() complaintReq: UpdateComplaintAdminReq) {
    const {status, id} = complaintReq;
    return new ResultUtils().success(await this.complaintService.updateComplainByAdmin(id, status));
  }
}