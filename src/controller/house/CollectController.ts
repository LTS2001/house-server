import { Body, Controller, Get, Inject, Put, Query } from '@midwayjs/core';
import { JwtMiddleware } from '@/middleware/JwtMiddleware';
import { ChangeCollectReq, GetCollectReq } from '@/dto/house/CollectDto';
import { CollectService } from '@/service/house/CollectService';
import { ResultUtils } from '@/common/ResultUtils';
import { ToolUtil } from '@/utils/ToolUtil';

@Controller('/collect')
export class CollectController {
  @Inject()
  private collectService: CollectService;

  /**
   * 更改收藏状态（收藏/取消收藏）
   * @param changeCollectReq
   */
  @Put('/', {middleware: [JwtMiddleware]})
  async changeCollectStatus(@Body() changeCollectReq: ChangeCollectReq) {
    return new ResultUtils().success(await this.collectService.changeCollectStatus(changeCollectReq));
  }

  /**
   * 获取收藏状态
   * @param getCollectReq
   */
  @Get('/', {middleware: [JwtMiddleware]})
  async getCollectStatus(@Query() getCollectReq: GetCollectReq) {
    return new ResultUtils().success(await this.collectService.getCollectStatus(getCollectReq));
  }

  /**
   * 获取房屋收藏总数
   * @param houseIdList
   */
  @Get('/num')
  async getCollectHouseNum(@Query('houseIdList') houseIdList: string) {
    const ids = ToolUtil.splitIdList(houseIdList);
    return new ResultUtils().success(await this.collectService.getCollectHouseNum(ids));
  }

  /**
   * 获取租客的收藏房屋
   * @param tenantId
   */
  @Get('/tenant', {middleware: [JwtMiddleware]})
  async getCollectHouseByTenantId(@Query('tenantId') tenantId: number) {
    return new ResultUtils().success(await this.collectService.getCollectHouseByTenantId(tenantId));
  }
}