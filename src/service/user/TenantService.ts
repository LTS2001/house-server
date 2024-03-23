import { Inject, Provide } from '@midwayjs/core';
import { RedisService } from '@midwayjs/redis';
import { Tenant } from '@/entities/Tenant';
import { CryptoUtil } from '@/utils/CryptoUtil';
import { TenantDao } from '@/dao/user/TenantDao';
import { Context } from '@midwayjs/koa';
import { JwtService } from '@midwayjs/jwt';
import { UpdateTenantReq } from '@/dto/user/TenantDto';
import { LeaseDao } from '@/dao/house/LeaseDao';
import { TENANT_HEAD_IMG, TENANT_NAME } from '@/constant/userConstant';
import { LeaseService } from '@/service/house/LeaseService';
import { LEASE_TRAVERSE } from '@/constant/leaseConstant';

@Provide()
export class TenantService {
  @Inject()
  private ctx: Context;
  @Inject()
  private redisService: RedisService;
  @Inject()
  private leaseService: LeaseService;
  @Inject()
  private tenantDao: TenantDao;
  @Inject()
  private jwtService: JwtService;
  @Inject()
  private leaseDao: LeaseDao;


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
      tenantObj.name = TENANT_NAME;
      tenantObj.headImg = TENANT_HEAD_IMG;
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
    // 查询租客租赁记录（已通过的）
    const leaseList = await this.leaseDao.getLeaseByTenantId(tenantId);
    const leaseTraverse = leaseList?.filter(l => l.status === LEASE_TRAVERSE);
    return await this.leaseService.getHouseInfoByLeaseList(leaseTraverse);
  }
}