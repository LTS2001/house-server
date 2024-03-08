import { Inject, Provide } from '@midwayjs/core';
import { RedisService } from '@midwayjs/redis';
import { UserTenant } from '@/entities/UserTenant';
import { CryptoUtil } from '@/utils/CryptoUtil';
import { TenantDao } from '@/dao/user/TenantDao';
import { Context } from '@midwayjs/koa';
import { JwtService } from '@midwayjs/jwt';
import { UpdateUserReq } from '@/dto/user/tenant/UpdateUserReq';
import { LeaseDao } from '@/dao/link/LeaseDao';
import { InfoDao } from '@/dao/house/InfoDao';
import { LandlordDao } from '@/dao/user/LandlordDao';

@Provide()
export default class TenantService {
  @Inject()
  private ctx: Context;
  @Inject()
  private redisService: RedisService;
  @Inject()
  private userTenantDao: TenantDao;
  @Inject()
  private jwtService: JwtService;
  @Inject()
  private leaseDao: LeaseDao;
  @Inject()
  private houseInfoDao: InfoDao;
  @Inject()
  private landlordDao: LandlordDao;

  /**
   * 登录
   * @param phone 手机号
   * @return userTenant 实体
   */
  async login(phone: string) {
    let userTenant: UserTenant;
    // 检测用户是否已经注册，没有注册的，则直接进行注册
    userTenant = await this.userTenantDao.getUserByPhone(phone);
    // 进行用户注册
    if (!userTenant)
      userTenant = await this.userTenantDao.addUser(phone);
    const encryptPhone = CryptoUtil.encryptStr(phone);
    // 设置JWT响应头
    this.ctx.set('Token', `Bearer ${ this.jwtService.signSync({phone: encryptPhone}) }`);
    this.ctx.set('Access-Control-Expose-Headers', 'Token');
    // 用户信息存入redis
    await this.redisService.set(phone, JSON.stringify(userTenant));
    return userTenant;
  }

  /**
   * 获取用户信息
   * @param phone 手机号
   * @param userTenant 实体对象
   */
  async getUser(phone: string) {
    const userTenant = await this.userTenantDao.getUserByPhone(phone);
    await this.redisService.set(phone, JSON.stringify(userTenant));
    return userTenant;
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
    const userTenant = await this.userTenantDao.updateUserHeadImg(phone, imgUrl);
    return userTenant.headImg;
  }

  /**
   * 更新用户信息
   * @param phone 手机号
   * @param updateInfo 更新的信息
   * @return userTenant 实体对象
   */
  async updateUser(phone: string, updateInfo: UpdateUserReq) {
    // 删除redis里面的key缓存
    await this.redisService.del(phone);
    return await this.userTenantDao.updateUser(phone, updateInfo);
  }

  /**
   * 获取租客租赁的房屋
   * @param tenantId 租客id
   */
  async getUserLeaseHouse(tenantId: number) {
    // 查询租客租赁记录
    const leaseList = await this.leaseDao.getLeaseByTenantId(tenantId);
    const houseIdList = leaseList.map(lease => lease.houseId);
    // 查询房屋信息
    const houseList = await this.houseInfoDao.getHouseInfoByHouseIds(houseIdList);
    const landlordIdList = houseList.map(house => house.landlordId);
    // 查询房东信息
    const landlordList = await this.landlordDao.getUsersByIds(landlordIdList);

    const resultList = leaseList.map((lease, idx) => {
      const leaseId = lease.id;
      delete lease.id;
      delete houseList[idx].id;
      const landlordId = landlordList[idx].id;
      delete landlordList[idx].id;
      return {
        ...lease,
        ...houseList[idx],
        ...landlordList[idx],
        leaseId,
        landlordId,
      };
    });

    return resultList;
  }
}