import { Inject, Provide } from '@midwayjs/core';
import { subscribeResponse, WechatUtil } from '@/utils/WechatUtil';
import { Context } from 'koa';
import { TenantDao } from '@/dao/user/TenantDao';
import { Tenant } from '@/entities/Tenant';
import { RentBillDao } from '@/dao/house/RentBillDao';
import { LandlordDao } from '@/dao/user/LandlordDao';
import { HouseDao } from '@/dao/house/HouseDao';
import { STATIC_ROOT, UPLOAD_ROOT } from '@/constant/imageConstant';

interface AcceptWechatMsg {
  ToUserName: string;
  FromUserName: string;
  CreateTime: string;
  MsgType: 'text' | 'image' | 'event';
  // 发送消息时有
  MsgId?: string;
  // 关注/取消关注
  Event?: 'subscribe' | 'unsubscribe';
  // 图片
  PicUrl: string;
  MediaId: string;
  // 文字
  Content: string;
  [key: string]: any;
}

@Provide()
export class WechatService {
  @Inject()
  private ctx: Context;
  @Inject()
  private tenantDao: TenantDao;
  @Inject()
  private rentBillDao: RentBillDao;
  @Inject()
  private landlordDao: LandlordDao;
  @Inject()
  private houseDao: HouseDao;

  /**
   * 回复微信服务器
   * @param msgObj
   * @returns
   */
  async responseToWechat(msgObj: AcceptWechatMsg) {
    switch (msgObj.MsgType) {
      case 'event':
        if (msgObj.Event === 'subscribe') {
          return subscribeResponse();
        }
      case 'text':
        return this.textMessageHandle(msgObj.Content);
      case 'image':
        return {
          type: 'image',
          content: {
            mediaId: msgObj.MediaId,
          },
        };
    }
  }

  /**
   * 处理文字
   * @param textContent 文字内容
   */
  async textMessageHandle(textContent: string) {
    // await WechatUtil.uploadTemporary({
    //   type: 'image',
    //   path: 'https://litaosheng.top:10000/static/common/male.png',
    // });
    const { FromUserName } = this.ctx.messageObj;
    /**
     * 前置：
     * 1. 一般来讲应该不需要这一步的，（小程序、公众号）绑定微信开放平台之后会传过来，但是个人开发者无法在微信开放平台绑定公众号
     * 2. 在小程序注册登录的时候就可以拿到用户的unionid，公众号在用户发送的消息中会传递过来unionid
     * 查询发送方的openid是否已经绑定手机号码
     */
    // 校验发送的是否是手机号（为公众号openid绑定手机号）
    if (/^1[3-9]\d{9}$/.test(textContent)) {
      const tenant = await this.tenantDao.getTenantByPhone(textContent);
      if (!tenant?.id) {
        return '该手机号没有在“LTS行间小筑小程序【租客】”中注册哟！';
      }
      // 公众号openid未绑定手机号
      else if (tenant?.id && !tenant?.officialOpenid) {
        const t = new Tenant();
        t.officialOpenid = FromUserName;
        await this.tenantDao.updateTenant(tenant.phone, t);
        return '用户绑定手机号成功！';
      } else if(tenant?.id && tenant?.officialOpenid) {
        return '请正确输入您所注册的手机号哟！'
      }
      // 之前绑定手机号
      else {
        return subscribeResponse();
      }
    } else {
      const tenant = await this.tenantDao.getTenantByOfficialOpenid(
        FromUserName
      );
      // 未绑定手机号
      if (!tenant?.id) {
        return '您还没有绑定手机号哟！请直接发送您在LTS行间小筑小程序注册的手机号';
      }
      // 校验月租账单
      const match = textContent?.match(/(?<!\d)(\d{4})年(\d{1,2})月账单$/);
      if (match) {
        const year = match[1];
        let month = match[2];
        if (month.length === 1) {
          month = '0' + month;
        }
        // 查询该租客在x年x月的账单
        const bills = await this.rentBillDao.getRentBillByTenantIdAndBillDate({
          tenantId: tenant.id,
          billDate: `${year}-${month}-01`,
        });
        if (bills.length === 0) {
          return `${year}年${month}月没有账单哟！`;
        }
        const landlords = await this.landlordDao.getLandlordByIds(
          bills.map(b => b.landlordId)
        );
        const houses = await this.houseDao.getHouseByHouseIds(
          bills.map(b => b.houseId)
        );
        const pngUrl = [];
        const promises = bills.map(bill => {
          return new Promise(async (resolve, reject) => {
            const landlord = landlords.find(l => l.id === bill.landlordId);
            const house = houses.find(h => h.id === bill.houseId);
            const pngName = `${year}-${month}_${tenant.phone}_${house.id}_${
              landlord.id
            }_${new Date().getTime()}.png`;
            resolve({
              houseName: house.name,
              landlordName: landlord.identityName,
              url: `${STATIC_ROOT}/${pngName}`,
            });
            pngUrl.push(`/${pngName}`);
            try {
              await WechatUtil.generateRentBillPNG(
                {
                  ...bill,
                  id: bill.id.toString().padStart(7, '0'),
                  tenantName: tenant.identityName,
                  landlordName: landlord.identityName,
                  houseName: house.name,
                  billDate: `${year}年${month}月`,
                  housePrice: house.price,
                  waterFee: house.waterFee,
                  electricityFee: house.electricityFee,
                  fuelFee: house.fuelFee,
                },
                `${UPLOAD_ROOT}/${pngName}`
              );
            } catch (error) {}
          });
        });
        return (await Promise.all(promises))
          .map(({ url, houseName, landlordName }) => {
            return `${landlordName}_${houseName}：${url}`;
          })
          .join('\n');
      }
      // 校验租赁合同
      else if (textContent === '租赁合同') {
        WechatUtil.generateRentBillPDF({ date: '2024-12-29' }, 'rent-bill.pdf');
        return '匹配上了租赁合同';
      } else {
        return subscribeResponse();
      }
    }
  }

  async imageMessageHandle() {}

  /**
   * 获取用户的openid
   * @param code 微信wx.login返回的code
   */
  async getUserOpenId(code: string) {
    // const { appid, appSecret } = appletConfig;
    // const data = await wechatAxios.get(
    //   `/sns/jscode2session?appid=${appid}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`
    // );
    return code;
  }
}
