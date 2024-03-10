import { Body, Controller, Get, Inject, Put, Query } from '@midwayjs/core';
import { JwtMiddleware } from '@/middleware/JwtMiddleware';
import { ChangeCollectReq, GetCollectReq } from '@/dto/house/CollectDto';
import { CollectService } from '@/service/house/CollectService';
import { ResultUtils } from '@/common/ResultUtils';
import { BusinessException } from '@/exception/BusinessException';
import { ResponseCode } from '@/common/ResponseFormat';

@Controller('/collect', {middleware: [JwtMiddleware]})
export class CollectController {
  @Inject()
  private collectService: CollectService;

  /**
   * 更改收藏状态（收藏/取消收藏）
   * @param changeCollectReq
   */
  @Put('/')
  async changeCollectStatus(@Body() changeCollectReq: ChangeCollectReq) {
    return new ResultUtils().success(await this.collectService.changeCollectStatus(changeCollectReq));
  }

  /**
   * 获取收藏状态
   * @param getCollectReq
   */
  @Get('/')
  async getCollectStatus(@Query() getCollectReq: GetCollectReq) {
    return new ResultUtils().success(await this.collectService.getCollectStatus(getCollectReq));
  }

  /**
   * 获取房屋收藏总数
   * @param houseIdList
   */
  @Get('/num')
  async getCollectHouseNum(@Query('houseIdList') houseIdList: string) {
    const list = houseIdList.split(',');
    const ids = list.map(id => {
      if (Boolean(Number(id))) {
        return Number(id);
      } else {
        throw new BusinessException(ResponseCode.PARAMS_ERROR);
      }
    });
    return new ResultUtils().success(await this.collectService.getCollectHouseNum(ids));
  }
}