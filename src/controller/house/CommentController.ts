import { Body, Controller, Get, Inject, Post, Put, Query } from '@midwayjs/core';
import { JwtMiddleware } from '@/middleware/JwtMiddleware';
import { AddCommentReq, GetCommentReq, UpdateCommentReq } from '@/dto/house/CommentDto';
import { ResultUtils } from '@/common/ResultUtils';
import { CommentService } from '@/service/house/CommentService';
import { GetCommentAdminReq } from '@/dto/user/AdminDto';

@Controller('/comment')
export class CommentController {

  @Inject()
  private commentService: CommentService;

  @Post('/', {middleware: [JwtMiddleware]})
  async addComment(@Body() addCommentReq: AddCommentReq) {
    return new ResultUtils().success(await this.commentService.addComment(addCommentReq));
  }

  @Get('/id', {middleware: [JwtMiddleware]})
  async getCommentByHouseAndTenantId(@Query() getCommentReq: GetCommentReq) {
    const {houseId, tenantId} = getCommentReq;
    return new ResultUtils().success(await this.commentService.getCommentByHouseAndTenantId(houseId, tenantId));
  }

  @Get('/tenantId', {middleware: [JwtMiddleware]})
  async getCommentByTenantId(@Query('tenantId') tenantId: number) {
    return new ResultUtils().success(await this.commentService.getCommentByTenantId(tenantId));
  }

  @Get('/houseId', {middleware: [JwtMiddleware]})
  async getCommentByHouseId(@Query('houseId') houseId: number) {
    return new ResultUtils().success(await this.commentService.getCommentByHouseId(houseId));
  }

  /**
   * 管理员获取房屋评论信息
   */
  @Post('/admin/get', {middleware: [JwtMiddleware]})
  async getCommentByAdmin(@Body() getCommentReq: GetCommentAdminReq) {
    Object.keys(getCommentReq).forEach(key => {
      if (!getCommentReq[key] && getCommentReq[key] !== 'status' && getCommentReq[key] !== 0) {
        delete getCommentReq[key];
      }
    });
    return new ResultUtils().success(await this.commentService.getCommentByAdmin(getCommentReq));
  }

  @Put('/admin', {middleware: [JwtMiddleware]})
  async updateCommentStatus(@Body() commentReq: UpdateCommentReq) {
    const {status, id} = commentReq;
    return new ResultUtils().success(await this.commentService.updateCommentStatus(id, status));
  }
}