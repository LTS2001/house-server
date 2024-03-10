import { Inject, Provide } from '@midwayjs/core';
import { RedisService } from '@midwayjs/redis';
import { Tenant } from '@/entities/Tenant';
import { CryptoUtil } from '@/utils/CryptoUtil';
import { TenantDao } from '@/dao/user/TenantDao';
import { Context } from '@midwayjs/koa';
import { JwtService } from '@midwayjs/jwt';
import { UpdateTenantReq } from '@/dto/user/TenantDto';
import { LeaseDao } from '@/dao/house/LeaseDao';
import { HouseDao } from '@/dao/house/HouseDao';
import { LandlordDao } from '@/dao/user/LandlordDao';
import { AddressDao } from '@/dao/house/AddressDao';
import { House } from '@/entities/House';
import { Landlord } from '@/entities/Landlord';
import { HouseAddress } from '@/entities/HouseAddress';

@Provide()
export class TenantService {
  @Inject()
  private ctx: Context;
  @Inject()
  private redisService: RedisService;
  @Inject()
  private tenantDao: TenantDao;
  @Inject()
  private jwtService: JwtService;
  @Inject()
  private leaseDao: LeaseDao;
  @Inject()
  private houseInfoDao: HouseDao;
  @Inject()
  private landlordDao: LandlordDao;
  @Inject()
  private addressDao: AddressDao;

  /**
   * 登录
   * @param phone 手机号
   * @return Tenant 实体
   */
  async login(phone: string) {
    let tenant: Tenant;
    // 检测用户是否已经注册，没有注册的，则直接进行注册
    tenant = await this.tenantDao.getTenantByPhone(phone);
    // 进行用户注册
    if (!tenant) {
      const tenantObj = new Tenant();
      tenantObj.phone = phone;
      tenantObj.name = '单身租客';
      tenantObj.headImg = 'male.png';
      tenant = await this.tenantDao.addTenant(tenantObj);
    }
    const encryptPhone = CryptoUtil.encryptStr(phone);
    // 设置JWT响应头
    this.ctx.set('Token', `Bearer ${ this.jwtService.signSync({phone: encryptPhone}) }`);
    this.ctx.set('Access-Control-Expose-Headers', 'Token');
    // 用户信息存入redis
    await this.redisService.set(phone, JSON.stringify(tenant));
    return tenant;
  }

  /**
   * 获取租客信息
   * @param phone 手机号
   * @return Tenant 实体对象
   */
  async getTenant(phone: string) {
    const tenant = await this.tenantDao.getTenantByPhone(phone);
    await this.redisService.set(phone, JSON.stringify(tenant));
    return tenant;
  }

  /**
   * 更新租客头像
   * @param phone 手机号
   * @param imgUrl 图片url
   * @return imgUrl 数据库存储的img url
   */
  async updateTenantHeadImg(phone: string, imgUrl: string) {
    // 删除redis里面的key
    await this.redisService.del(phone);
    const tenant = await this.tenantDao.updateTenantHeadImg(phone, imgUrl);
    return tenant.headImg;
  }

  /**
   * 更新租客信息
   * @param phone 手机号
   * @param updateInfo 更新的信息
   * @return Tenant 实体对象
   */
  async updateTenant(phone: string, updateInfo: UpdateTenantReq) {
    // 删除redis里面的key缓存
    await this.redisService.del(phone);
    const tenant = new Tenant();
    const {name, remark} = updateInfo;
    if (name) tenant.name = name;
    if (remark) tenant.remark = remark;
    return await this.tenantDao.updateTenant(phone, tenant);
  }

  /**
   * 获取租客租赁的房屋
   * @param tenantId 租客id
   */
  async getUserLeaseHouse(tenantId: number) {
    // 查询租客租赁记录
    const leaseList = await this.leaseDao.getLeaseByTenantId(tenantId);
    // 查询房屋信息
    const houseList = await this.houseInfoDao.getHouseByHouseIds(
      leaseList.map(lease => lease.houseId)
    );
    // 查询房东信息
    const landlordList = await this.landlordDao.getLandlordByIds(
      leaseList.map(lease => lease.landlordId)
    );
    // 查询房屋地址信息
    const addressList = await this.addressDao.getHouseAddress(
      houseList.map(house => house.addressId)
    );

    const resultList = leaseList.map((lease, idx) => {
      const leaseId = lease.id;
      delete lease.id;
      // 当前的房屋信息
      const house = JSON.parse(JSON.stringify(houseList[idx])) as House;
      const houseId = house.id;
      const houseName = house.name;
      const houseImg = house.houseImg;
      delete house.id;
      delete house.name;
      delete house.houseImg;
      // 当前的房东信息
      const landlord = JSON.parse(JSON.stringify(landlordList.find(l => l.id === house.landlordId))) as Landlord;
      const landlordId = landlord.id;
      const landlordName = landlord.name;
      const landlordImg = landlord.headImg;
      const landlordPhone = landlord.phone;
      delete landlord.id;
      delete landlord.name;
      delete landlord.headImg;
      delete landlord.phone;
      // 当前的房屋地址信息
      const address = JSON.parse(JSON.stringify(addressList.find(a => a.id === house.addressId))) as HouseAddress;
      delete address.id;
      return {
        ...address,
        ...house,
        houseName,
        houseImg,
        ...landlord,
        landlordName,
        landlordImg,
        landlordPhone,
        ...lease,
        leaseId,
        landlordId,
        houseId
      };
    });

    return resultList;
  }
}