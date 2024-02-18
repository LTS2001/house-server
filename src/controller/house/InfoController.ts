import {Body, Controller, File, Get, Inject, Post, Put, Query} from "@midwayjs/core";
import {JwtMiddleware} from "../../middleware/JwtMiddleware";
import {AddHouseReq} from "../../dto/house/info/AddHouseReq";
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
   * 获取房屋信息
   */
  @Get('/', {middleware: [JwtMiddleware]})
  async getHouseInfo() {
    const user = this.ctx.user;
    const result = await this.infoService.getHouseInfo(user.id);
    return new ResultUtils().success(result);
  }

  /**
   * 上传房屋图片
   */
  @Post('/img', {middleware: [JwtMiddleware]})
  async uploadHouseImg(@File() file: any) {
    const imgUrlArr = file.data?.split('\\');
    return new ResultUtils().success(imgUrlArr[imgUrlArr.length - 1]);
  }

  /**
   * 修改房屋图片
   */
  @Put('/img', {middleware: [JwtMiddleware]})
  async updateHouseImg(@File() file: any, @Query('houseId') houseId: number) {
    console.log('houseId', houseId)
    const imgUrlArr = file.data?.split('\\');
    return new ResultUtils().success(imgUrlArr[imgUrlArr.length - 1]);
  }
}
