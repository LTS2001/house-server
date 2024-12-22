import { Inject, Provide } from '@midwayjs/core';
import { LandlordDao } from '@/dao/user/LandlordDao';
import { CryptoUtil } from '@/utils/CryptoUtil';
import { Landlord } from '@/entities/Landlord';
import { Context } from '@midwayjs/koa';
import { RedisService } from '@midwayjs/redis';
import { JwtService } from '@midwayjs/jwt';
import { LandlordDto } from '@/dto/user/LandlordDto';
import {
  LANDLORD_HEAD_IMG,
  LANDLORD_NAME,
  USER_STATUS_DELETE,
  USER_STATUS_NORMAL,
  USER_STATUS_STOP_USING,
} from '@/constant/userConstant';
import { LeaseDao } from '@/dao/house/LeaseDao';
import { TenantDao } from '@/dao/user/TenantDao';
import { BusinessException } from '@/exception/BusinessException';
import { ResponseCode } from '@/common/ResponseFormat';
import { GetLandlordReq } from '@/dto/user/AdminDto';
import { HouseDao } from '@/dao/house/HouseDao';
import { AddressDao } from '@/dao/house/AddressDao';
import { Lease } from '@/utils/ServiceUtil';

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
  @Inject()
  private leaseDao: LeaseDao;
  @Inject()
  private tenantDao: TenantDao;
  @Inject()
  private houseDao: HouseDao;
  @Inject()
  private addressDao: AddressDao;

  /**
   * 登录
   * @param phone 手机号
   * @param password 密码
   * @return userLandlord 实体
   */
  async login(phone: string, password: string) {
    let landlord: Landlord;
    // 检测用户是否已经注册
    landlord = await this.landlordDao.getLandlordByPhone(phone);
    // 未注册
    if (!landlord) {
      throw new BusinessException(
        ResponseCode.NOT_FOUND_ERROR,
        '该手机号未注册！'
      );
    } else {
      if (landlord.password !== password)
        throw new BusinessException(ResponseCode.PARAMS_ERROR, '密码错误！');
      if (
        [USER_STATUS_STOP_USING, USER_STATUS_DELETE].includes(landlord.status)
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
    await this.redisService.set(phone, JSON.stringify(landlord));
    return landlord;
  }

  /**
   * 注册
   * @param phone 手机
   * @param password 密码
   */
  async registry(phone: string, password: string) {
    // 查询是否在租客注册了
    const tenant = await this.tenantDao.getTenantByPhone(phone);
    if (tenant?.id) {
      throw new BusinessException(
        ResponseCode.PARAMS_ERROR,
        '该手机号已被租客身份注册'
      );
    }
    const landlord = await this.landlordDao.getLandlordByPhone(phone);
    if (landlord?.id) {
      throw new BusinessException(ResponseCode.PARAMS_ERROR, '该手机号已注册');
    }
    const landlordObj = new Landlord();
    landlordObj.phone = phone;
    landlordObj.password = password;
    landlordObj.name = LANDLORD_NAME;
    landlordObj.headImg = LANDLORD_HEAD_IMG;
    return await this.landlordDao.addLandlord(landlordObj);
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
    const userLandlord = await this.landlordDao.updateLandlordHeadImg(
      phone,
      imgUrl
    );
    // 用户信息存入redis
    await this.redisService.set(phone, JSON.stringify(userLandlord));
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
    const { identityNumber } = updateInfo;
    // 校验该身份证号码是否已被他人实名
    if (identityNumber) {
      // 先校验该手机号是否已经实名
      const existLandlord = await this.landlordDao.getLandlordByPhone(phone);
      if (existLandlord.identityNumber)
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
          '该身份证已被占用，请联系管理员'
        );
      }
    }
    const landlord = new Landlord();
    Reflect.ownKeys(updateInfo).forEach(key => {
      if (updateInfo[key]) {
        landlord[key] = updateInfo[key];
      }
    });
    // 如果有传递身份证号码，则更改房东的状态为已实名
    if (identityNumber) {
      landlord.status = USER_STATUS_NORMAL;
    }
    await this.landlordDao.updateLandlord(phone, landlord);
    // 重新查询才可以拿到最新的更新时间
    const updateLandlord = await this.landlordDao.getLandlordByPhone(phone);
    // 删除redis里面的key缓存
    await this.redisService.del(phone);
    // 用户信息存入redis
    await this.redisService.set(phone, JSON.stringify(updateLandlord));
    return updateLandlord;
  }

  /**
   * 通过房东id列表获取房东信息列表
   * @param landlordIds
   */
  async getLandlordByIds(landlordIds: Array<number>) {
    return await this.landlordDao.getLandlordByIds(landlordIds);
  }

  /**
   * 通过房东id租客信息
   * @param landlordId
   */
  async getTenantsByLandlordId(landlordId: number) {
    // 查询当前房东已经通过租赁的租客
    const leaseList = await this.leaseDao.getLeaseByLandlordId(landlordId);
    // 查询房屋信息
    const houseList = await this.houseDao.getHouseByHouseIds(
      leaseList.map(l => l.houseId)
    );
    // 查询房屋地址信息
    const addressList = await this.addressDao.getHouseAddress(
      houseList.map(h => h.addressId)
    );
    // 查询租客信息
    const tenantList = await this.tenantDao.getTenantByIds(
      leaseList.map(l => l.tenantId)
    );
    return leaseList.map(lease => {
      const house = houseList.find(h => h.id === lease.houseId);
      const address = addressList.find(a => a.id === house.addressId);
      const tenant = tenantList.find(t => t.id === lease.tenantId);
      return Lease.formatLeaseMsg({
        house,
        address,
        tenant,
        lease,
        landlordId,
      });
    });
  }

  async getLandlordByAdmin(getLandlordReq: GetLandlordReq) {
    const { list, total } = await this.landlordDao.getLandlordByAdmin(
      getLandlordReq
    );
    const { current, pageSize } = getLandlordReq;
    return {
      total,
      current,
      pageSize,
      list,
    };
  }

  async updateLandlordStatus(id: number, status: number) {
    return await this.landlordDao.updateLandlordStatus(id, status);
  }
}
