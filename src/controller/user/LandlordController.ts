import { Body, Controller, Files, Get, Inject, Post, Put, Query } from '@midwayjs/core';
import { ValidateUtil } from '@/utils/ValidateUtil';
import { BusinessException } from '@/exception/BusinessException';
import { ResponseCode } from '@/common/ResponseFormat';
import { LandlordService } from '@/service/user/LandlordService';
import { ResultUtils } from '@/common/ResultUtils';
import { Context } from '@midwayjs/koa';
import { Landlord } from '@/entities/Landlord';
import { JwtMiddleware } from '@/middleware/JwtMiddleware';
import { JwtService } from '@midwayjs/jwt';
import { AuthUtil } from '@/utils/AuthUtil';
import { LandlordDto } from '@/dto/user/LandlordDto';

@Controller('/landlord')
export class LandlordController {
  @Inject()
  ctx: Context;
  @Inject()
  jwtService: JwtService;
  @Inject()
  landlordService: LandlordService;

  /**
   * 登录
   * @param phone
   */
  @Post('/login')
  async login(@Body('phone') phone: string) {
    const flag = ValidateUtil.validatePhone(phone);
    if (!flag) throw new BusinessException(ResponseCode.PARAMS_ERROR, '输入的手机号不正确！');
    const landlord = await this.landlordService.login(phone);
    return new ResultUtils().success(landlord);
  }

  /**
   * 获取当前房东信息
   */
  @Get('/', {middleware: [JwtMiddleware]})
  async getUser() {
    const decryptPhone = await new AuthUtil().getUserFromToken(this.ctx, this.jwtService);
    const landlord = await this.landlordService.getLandlord(decryptPhone);
    return new ResultUtils().success<Landlord>(landlord);
  }

  /**
   * 更新房东信息
   */
  @Put('/', {middleware: [JwtMiddleware]})
  async updateUser(@Body() updateLandlord: LandlordDto) {
    const {phone} = this.ctx.user;
    const landlord = await this.landlordService.updateLandlord(phone, updateLandlord);
    return new ResultUtils().success<Landlord>(landlord);
  }

  /**
   * 更新房东头像
   */
  @Post('/headImg', {middleware: [JwtMiddleware]})
  async updateUserHeadImg(@Files() files: any) {
    const imgUrlArr = files[0].data?.split('\\');
    const imgUrl = imgUrlArr[imgUrlArr.length - 1];
    const {phone} = this.ctx.user;
    const url = await this.landlordService.updateHeadImg(phone, imgUrl);
    return new ResultUtils().success<string>(url);
  }

  /**
   * 获取房东信息
   * @param landlordIds 房东id列表
   */
  @Get('/list')
  async getUsersByIds(@Query('ids') landlordIds: string) {
    const idsStr = landlordIds.split(',');
    const idsNum = idsStr.map(id => (Number(id)));
    return new ResultUtils().success(await this.landlordService.getLandlordByIds([...new Set(idsNum)]));
  }
}
