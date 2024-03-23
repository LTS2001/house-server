import { Body, Controller, Del, File, Get, Inject, Post, Put, Query } from '@midwayjs/core';
import { JwtMiddleware } from '@/middleware/JwtMiddleware';
import { AddHouseReq, UpdateHouseReq } from '@/dto/house/HouseDto';
import { HouseService } from '@/service/house/HouseService';
import { ResultUtils } from '@/common/ResultUtils';
import { Context } from '@midwayjs/koa';
import { BusinessException } from '@/exception/BusinessException';
import { ResponseCode } from '@/common/ResponseFormat';

@Controller('/house')
export class HouseController {
  @Inject()
  private ctx: Context;
  @Inject()
  private houseService: HouseService;

  /**
   * 添加房屋
   * @param house 房屋信息
   */
  @Post('/', {middleware: [JwtMiddleware]})
  async addHouseInfo(@Body() house: AddHouseReq) {
    const user = this.ctx.user;
    const result = await this.houseService.addHouse(user, house);
    return new ResultUtils().success(result);
  }

  /**
   * 更新一个房屋
   * @param house 房屋信息
   */
  @Put('/', {middleware: [JwtMiddleware]})
  async updateHouseInfo(@Body() house: UpdateHouseReq) {
    const res = await this.houseService.updateHouse(house);
    return new ResultUtils().success(res);
  }

  /**
   * 获取房屋信息
   */
  @Get('/', {middleware: [JwtMiddleware]})
  async getHouseInfo() {
    const user = this.ctx.user;
    const result = await this.houseService.getHouse(user.id);
    return new ResultUtils().success(result);
  }


  /**
   * 添加房屋图片
   */
  @Post('/img', {middleware: [JwtMiddleware]})
  async addHouseImg(@File() file: any) {
    const imgUrlArr = file.data?.split('\\');
    return new ResultUtils().success(imgUrlArr[imgUrlArr.length - 1]);
  }

  /**
   * 修改房屋图片
   */
  @Put('/img', {middleware: [JwtMiddleware]})
  async updateHouseImg(@File() file: any, @Query('houseId') houseId: number) {
    const imgUrlArr = file.data?.split('\\');
    return new ResultUtils().success(imgUrlArr[imgUrlArr.length - 1]);
  }

  /**
   * 删除房屋图片
   */
  @Del('/img', {middleware: [JwtMiddleware]})
  async delHouseImg(@Body() info: { houseId: number, imgName: string }) {
    console.log(info);
    return new ResultUtils().success(await this.houseService.delHouseImg(info.houseId, info.imgName));
  }

  @Get('/page')
  async getHousesByPage() {
    return new ResultUtils().success(await this.houseService.getHouseByPage());
  }

  /**
   * 通过房屋id获取房屋列表
   */
  @Get('/list', {middleware: [JwtMiddleware]})
  async getHouseListByHouseId(@Query('houseIdList') houseIdList: string) {
    const list = houseIdList.split(',');
    const ids = list.map(id => {
      if (Boolean(Number(id))) {
        return Number(id);
      } else {
        throw new BusinessException(ResponseCode.PARAMS_ERROR);
      }
    });
    return new ResultUtils().success(await this.houseService.getHouseListByHouseId(ids));
  }
}
