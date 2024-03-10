import { Inject, Provide } from '@midwayjs/core';
import { LandlordDao } from '@/dao/user/LandlordDao';
import { CryptoUtil } from '@/utils/CryptoUtil';
import { Landlord } from '@/entities/Landlord';
import { Context } from '@midwayjs/koa';
import { RedisService } from '@midwayjs/redis';
import { JwtService } from '@midwayjs/jwt';
import { LandlordDto } from '@/dto/user/LandlordDto';

@Provide()
export class LandlordService {
  @Inject()
  private ctx: Context;
  @Inject()
  private landlordDao: LandlordDao;
  @Inject()
  private redisService: RedisService;
  @Inject()
  private jwtService: JwtService;


  /**
   * 登录
   * @param phone 手机号
   * @return userLandlord 实体
   */
  async login(phone: string) {
    let landlord: Landlord;
    // 检测用户是否已经注册，没有注册的，则直接进行注册
    landlord = await this.landlordDao.getLandlordByPhone(phone);
    // 进行用户注册
    if (!landlord) {
      const landlordObj = new Landlord();
      landlordObj.phone = phone;
      landlordObj.name = '单身房东';
      landlordObj.headImg = 'male.png';
      landlord = await this.landlordDao.addLandlord(landlordObj);
    }
    const encryptPhone = CryptoUtil.encryptStr(phone);
    // 设置JWT响应头
    this.ctx.set('Token', `Bearer ${ this.jwtService.signSync({phone: encryptPhone}) }`);
    this.ctx.set('Access-Control-Expose-Headers', 'Token');
    // 用户信息存入redis
    await this.redisService.set(phone, JSON.stringify(landlord));
    return landlord;
  }

  /**
   * 更新房东的头像
   * @param phone 手机号
   * @param imgUrl 图片url
   * @return imgUrl 数据库存储的img url
   */
  async updateHeadImg(phone: string, imgUrl: string) {
    // 删除redis里面的key
    await this.redisService.del(phone);
    const userLandlord = await this.landlordDao.updateLandlordHeadImg(phone, imgUrl);
    return userLandlord.headImg;
  }

  /**
   * 获取房东信息
   * @param phone 手机号
   * @return Landlord 实体对象
   */
  async getLandlord(phone: string) {
    const landlord = await this.landlordDao.getLandlord(phone);
    await this.redisService.set(phone, JSON.stringify(landlord));
    return landlord;
  }

  /**
   * 更新房东信息
   * @param phone 手机号
   * @param updateInfo 更新的信息
   * @return Landlord 实体对象
   */
  async updateLandlord(phone: string, updateInfo: LandlordDto) {
    // 删除redis里面的key缓存
    await this.redisService.del(phone);
    const landlord = new Landlord();
    const {name, remark} = updateInfo;
    if (!name) landlord.name = name;
    if (!remark) landlord.remark = remark;
    return await this.landlordDao.updateLandlord(phone, landlord);
  }

  /**
   * 通过房东id列表获取房东信息列表
   * @param landlordIds
   */
  async getLandlordByIds(landlordIds: Array<number>) {
    return await this.landlordDao.getLandlordByIds(landlordIds);
  }
}
