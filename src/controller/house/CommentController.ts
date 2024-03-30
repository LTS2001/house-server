import { Body, Controller, Get, Inject, Post, Query } from '@midwayjs/core';
import { JwtMiddleware } from '@/middleware/JwtMiddleware';
import { AddCommentReq, GetCommentReq } from '@/dto/house/CommentDto';
import { ResultUtils } from '@/common/ResultUtils';
import { CommentService } from '@/service/house/CommentService';

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
}