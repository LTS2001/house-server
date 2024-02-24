import {Body, Controller, Del, File, Get, Inject, Post, Put, Query} from "@midwayjs/core";
import {JwtMiddleware} from "../../middleware/JwtMiddleware";
import {AddHouseReq, UpdateHouseReq} from "../../dto/HouseInfo";
import {InfoService} from "../../service/house/InfoService";
import {ResultUtils} from "../../common/ResultUtils";
import {Context} from "@midwayjs/koa";

@Controller('/house/info')
export class InfoController {
  @Inject()
  private ctx: Context;
  @Inject()
  private infoService: InfoService;

  /**
   * 添加房屋
   * @param house 房屋信息
   */
  @Post('/', {middleware: [JwtMiddleware]})
  async addHouseInfo(@Body() house: AddHouseReq) {
    const user = this.ctx.user;
    const result = await this.infoService.addHouseInfo(user, house);
    return new ResultUtils().success(result);
  }

  /**
   * 更新一个房屋
   * @param house 房屋信息
   */
  @Put('/', {middleware: [JwtMiddleware]})
  async updateHouseInfo(@Body() house: UpdateHouseReq) {
    const res = await this.infoService.updateHouseInfo(house);
    return new ResultUtils().success(res);
  }

  /**
   * 获取房屋信息
   */
  @Get('/', {middleware: [JwtMiddleware]})
  async getHouseInfo() {
    const user = this.ctx.user;
    const result = await this.infoService.getHouseInfo(user.id);
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
    console.log(info)
    return new ResultUtils().success(await this.infoService.delHouseImg(info.houseId, info.imgName));
  }
}
