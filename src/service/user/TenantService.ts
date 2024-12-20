import { Inject, Provide } from '@midwayjs/core';
import { RedisService } from '@midwayjs/redis';
import { Tenant } from '@/entities/Tenant';
import { CryptoUtil } from '@/utils/CryptoUtil';
import { TenantDao } from '@/dao/user/TenantDao';
import { Context } from '@midwayjs/koa';
import { JwtService } from '@midwayjs/jwt';
import { UpdateTenantReq } from '@/dto/user/TenantDto';
import { LeaseDao } from '@/dao/house/LeaseDao';
import {
  TENANT_HEAD_IMG,
  TENANT_NAME,
  USER_STATUS_DELETE,
  USER_STATUS_STOP_USING,
  USER_STATUS_NORMAL,
} from '@/constant/userConstant';
import { LEASE_TRAVERSE } from '@/constant/leaseConstant';
import { HouseService } from '@/service/house/HouseService';
import { GetTenantReq } from '@/dto/user/AdminDto';
import { BusinessException } from '@/exception/BusinessException';
import { ResponseCode } from '@/common/ResponseFormat';
import { LandlordDao } from '@/dao/user/LandlordDao';

@Provide()
export class TenantService {
  @Inject()
  private ctx: Context;
  @Inject()
  private redisService: RedisService;
  @Inject()
  private houseService: HouseService;
  @Inject()
  private tenantDao: TenantDao;
  @Inject()
  private jwtService: JwtService;
  @Inject()
  private leaseDao: LeaseDao;
  @Inject()
  private landlordDao: LandlordDao;

  /**
   * 登录
   * @param phone 手机号
   * @return Tenant 实体
   */
  async login(phone: string, password: string) {
    let tenant: Tenant;
    // 检测用户是否已经注册
    tenant = await this.tenantDao.getTenantByPhone(phone);
    // 未注册
    if (!tenant) {
      throw new BusinessException(
        ResponseCode.NOT_FOUND_ERROR,
        '该手机号未注册！'
      );
    } else {
      if (tenant.password !== password) {
        throw new BusinessException(ResponseCode.PARAMS_ERROR, '密码错误！');
      }
      if (
        [USER_STATUS_STOP_USING, USER_STATUS_DELETE].includes(tenant.status)
      ) {
        throw new BusinessException(
          ResponseCode.FORBIDDEN_ERROR,
          '该账号异常！'
        );
      }
    }
    const encryptPhone = CryptoUtil.encryptStr(phone);
    // 设置JWT响应头
    this.ctx.set(
      'Token',
      `Bearer ${this.jwtService.signSync({ phone: encryptPhone })}`
    );
    this.ctx.set('Access-Control-Expose-Headers', 'Token');
    // 用户信息存入redis
    await this.redisService.set(phone, JSON.stringify(tenant));
    return tenant;
  }

  /**
   * 注册
   * @param phone 手机
   * @param password 密码
   */
  async registry(phone: string, password: string) {
    // 查询是否在房东注册了
    const landlord = await this.landlordDao.getLandlordByPhone(phone);
    if (landlord?.id) {
      throw new BusinessException(
        ResponseCode.PARAMS_ERROR,
        '该手机号已被房东身份注册'
      );
    }
    // 查询是否已经注册
    const tenant = await this.tenantDao.getTenantByPhone(phone);
    if (tenant?.id) {
      throw new BusinessException(ResponseCode.PARAMS_ERROR, '该手机号已注册');
    }
    const tenantObj = new Tenant();
    tenantObj.phone = phone;
    tenantObj.password = password;
    tenantObj.name = TENANT_NAME;
    tenantObj.headImg = TENANT_HEAD_IMG;
    return await this.tenantDao.addTenant(tenantObj);
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
    // 用户信息存入redis
    await this.redisService.set(phone, JSON.stringify(tenant));
    return tenant.headImg;
  }

  /**
   * 更新租客信息
   * @param phone 手机号
   * @param updateInfo 更新的信息
   * @return Tenant 实体对象
   */
  async updateTenant(phone: string, updateInfo: UpdateTenantReq) {
    const { identityNumber } = updateInfo;
    // 校验该身份证号码是否已被他人实名
    if (identityNumber) {
      // 先校验该手机号是否已经实名
      const existTenant = await this.tenantDao.getTenantByPhone(phone);
      if (existTenant.identityNumber)
        throw new BusinessException(
          ResponseCode.PARAMS_ERROR,
          '该手机号已实名'
        );
      // 查询房东表和租客表
      const landlord = await this.landlordDao.getLandlordByIdentityNumber(
        identityNumber
      );
      if (landlord?.id) {
        throw new BusinessException(
          ResponseCode.PARAMS_ERROR,
          '该身份证已被占用，请联系管理员'
        );
      }
      const tenant = await this.tenantDao.getTenantByIdentityNumber(
        identityNumber
      );
      if (tenant?.id) {
        throw new BusinessException(
          ResponseCode.PARAMS_ERROR,
          '该身份证已被使用，请联系管理员'
        );
      }
    }
    const tenant = new Tenant();
    Reflect.ownKeys(updateInfo).forEach(key => {
      if (updateInfo[key]) {
        tenant[key] = updateInfo[key];
      }
    });
    // 如果有传递身份证号码，则更改租客的状态为已实名
    if (identityNumber) {
      tenant.status = USER_STATUS_NORMAL;
    }
    await this.tenantDao.updateTenant(phone, tenant);
    // 重新查询才可以拿到最新的更新时间
    const updateTenant = await this.tenantDao.getTenantByPhone(phone);
    // 删除redis里面的key缓存
    await this.redisService.del(phone);
    // 用户信息存入redis
    await this.redisService.set(phone, JSON.stringify(updateTenant));
    return updateTenant;
  }

  /**
   * 获取租客租赁的房屋
   * @param tenantId 租客id
   */
  async getUserLeaseHouse(tenantId: number) {
    // 查询租客租赁记录（已通过的）
    const leaseList = await this.leaseDao.getLeaseByTenantId(tenantId);
    const leaseTraverse = leaseList?.filter(l => l.status === LEASE_TRAVERSE);
    const twoIdList = leaseTraverse.map(l => {
      const { houseId, landlordId } = l;
      return {
        houseId,
        landlordId,
      };
    });
    const houseInfoList = await this.houseService.getHouseByTwoIdList(
      twoIdList
    );
    return twoIdList.map(t => {
      const houseInfo = houseInfoList.find(
        h => h.landlordId === t.landlordId && h.houseId === t.houseId
      );
      const traverse = leaseTraverse.find(
        r => r.landlordId === t.landlordId && r.houseId === t.houseId
      );
      const leaseId = traverse.id;
      delete traverse.id;
      return {
        ...houseInfo,
        ...traverse,
        leaseId,
      };
    });
  }

  /**
   * 通过租客id获取租客信息
   * @param tenantIdList
   */
  async getTenantByIdList(tenantIdList: number[]) {
    return await this.tenantDao.getTenantByIds(tenantIdList);
  }

  async getTenantByAdmin(getTenantReq: GetTenantReq) {
    const { list, total } = await this.tenantDao.getTenantByAdmin(getTenantReq);
    const { current, pageSize } = getTenantReq;
    return {
      total,
      current,
      pageSize,
      list,
    };
  }

  async updateTenantStatus(id: number, status: number) {
    return await this.tenantDao.updateTenantStatus(id, status);
  }
}
