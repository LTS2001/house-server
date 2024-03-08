import { Inject, Provide } from '@midwayjs/core';
import { LandlordDao } from '../../dao/user/LandlordDao';
import { CryptoUtil } from '../../utils/CryptoUtil';
import { UserLandlord } from '../../entities/UserLandlord';
import { Context } from '@midwayjs/koa';
import { RedisService } from '@midwayjs/redis';
import { JwtService } from '@midwayjs/jwt';
import { UpdateUserReq } from '../../dto/user/landlord/UpdateUserReq';

@Provide()
export default class LandlordService {
  @Inject()
  private userLandlordDao: LandlordDao;
  @Inject()
  private ctx: Context;
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
    let userLandlord: UserLandlord;
    // 检测用户是否已经注册，没有注册的，则直接进行注册
    userLandlord = await this.userLandlordDao.getUserByPhone(phone);
    // 进行用户注册
    if (!userLandlord)
      userLandlord = await this.userLandlordDao.addUser(phone);
    const encryptPhone = CryptoUtil.encryptStr(phone);
    // 设置JWT响应头
    this.ctx.set('Token', `Bearer ${ this.jwtService.signSync({phone: encryptPhone}) }`);
    this.ctx.set('Access-Control-Expose-Headers', 'Token');
    // 用户信息存入redis
    await this.redisService.set(phone, JSON.stringify(userLandlord));
    return userLandlord;
  }

  /**
   * 更新用户的头像
   * @param phone 手机号
   * @param imgUrl 图片url
   * @return imgUrl 数据库存储的img url
   */
  async updateHeadImg(phone: string, imgUrl: string) {
    // 删除redis里面的key
    await this.redisService.del(phone);
    const userLandlord = await this.userLandlordDao.updateUserHeadImg(phone, imgUrl);
    return userLandlord.headImg;
  }

  /**
   * 获取用户信息
   * @param phone 手机号
   * @param userLandlord 实体对象
   */
  async getUser(phone: string) {
    const userLandlord = await this.userLandlordDao.getUser(phone);
    await this.redisService.set(phone, JSON.stringify(userLandlord));
    return userLandlord;
  }

  /**
   * 更新用户信息
   * @param phone 手机号
   * @param updateInfo 更新的信息
   * @return userLandlord 实体对象
   */
  async updateUser(phone: string, updateInfo: UpdateUserReq) {
    // 删除redis里面的key缓存
    await this.redisService.del(phone);
    return await this.userLandlordDao.updateUser(phone, updateInfo);
  }

  /**
   * 通过用户id列表获取用户信息列表
   * @param ids
   */
  async getUsersByIds(ids: Array<number>) {
    return await this.userLandlordDao.getUsersByIds(ids);
  }
}
