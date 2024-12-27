import { Body, Controller, Del, File, Get, Inject, Post, Put, Query } from '@midwayjs/core';
import { JwtMiddleware } from '@/middleware/JwtMiddleware';
import { AddHouseReq, GetHouseKeyWordReq, GetMarkHouseReq, UpdateHouseReq } from '@/dto/house/HouseDto';
import { HouseService } from '@/service/house/HouseService';
import { ResultUtils } from '@/common/ResultUtils';
import { Context } from '@midwayjs/koa';
import { ToolUtil } from '@/utils/ToolUtil';
import { GetHouseAdminReq, UpdateHouseStatusReq } from '@/dto/user/AdminDto';

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
    return new ResultUtils().success(await this.houseService.delHouseImg(info.houseId, info.imgName));
  }

  @Get('/page')
  async getHousesByPage(@Query() getMarkHouseReq: GetMarkHouseReq) {
    return new ResultUtils().success(await this.houseService.getHouseByPage(getMarkHouseReq));
  }

  @Get('/keyword')
  async getHouseByKeyword(@Query() getHouseReq: GetHouseKeyWordReq) {
    return new ResultUtils().success(await this.houseService.getHouseByKeyword(getHouseReq));
  }

  /**
   * 通过房屋id获取房屋列表
   */
  @Get('/list', {middleware: [JwtMiddleware]})
  async getHouseListByHouseId(@Query('houseIdList') houseIdList: string) {
    const ids = ToolUtil.splitIdList(houseIdList);
    return new ResultUtils().success(await this.houseService.getHouseListByHouseId(ids));
  }

  /**
   * 管理员获取房屋信息
   */
  @Post('/admin/get', {middleware: [JwtMiddleware]})
  async getHouseByAdmin(@Body() getHouseReq: GetHouseAdminReq) {
    Object.keys(getHouseReq).forEach(key => {
      if (!getHouseReq[key] && getHouseReq[key] !== 'status' && getHouseReq[key] !== 0) {
        delete getHouseReq[key];
      }
    });
    return new ResultUtils().success(await this.houseService.getHouseByAdmin(getHouseReq));
  }

  @Put('/admin', {middleware: [JwtMiddleware]})
  async updateHouseStatus(@Body() houseReq: UpdateHouseStatusReq) {
    const {status, id} = houseReq;
    return new ResultUtils().success(await this.houseService.updateHouseStatus(id, status));
  }
}
