import { InjectEntityModel } from '@midwayjs/orm';
import { Landlord } from '@/entities/Landlord';
import { Repository } from 'typeorm';
import { Provide } from '@midwayjs/core';

@Provide()
export class LandlordDao {
  @InjectEntityModel(Landlord)
  private landlordModel: Repository<Landlord>;

  /**
   * 通过手机号获取房东信息
   * @param phone 手机号
   * @return Landlord 实体对象
   */
  async getLandlordByPhone(phone: string) {
    return await this.landlordModel.findOne({
      where: {phone}
    });
  }

  /**
   * 添加房东
   * @param landlordObj 手机号
   * @return Landlord 实体对象
   */
  async addLandlord(landlordObj: Landlord): Promise<Landlord> {
    const landlord = new Landlord();
    Object.keys(landlordObj).forEach(key => {
      landlord[key] = landlordObj[key];
    });
    return await this.landlordModel.save(landlord);
  }

  /**
   * 更新房东头像
   * @param phone 用户手机号
   * @param imgUrl 图片url
   * @return Landlord 实体对象
   */
  async updateLandlordHeadImg(phone: string, imgUrl: string) {
    const landlord = await this.landlordModel.findOne({
      where: {phone}
    });
    landlord.headImg = imgUrl;
    return await this.landlordModel.save(landlord);
  }

  /**
   * 获取房东
   * @param phone 手机号
   * @return Landlord 实体对象
   */
  async getLandlord(phone: string) {
    return await this.landlordModel.findOne({
      where: {phone}
    });
  }

  /**
   * 更新房东信息
   * @param phone 手机号
   * @param landlordObj 更新的房东信息
   */
  async updateLandlord(phone: string, landlordObj: Landlord) {
    const landlord = await this.landlordModel.findOne({
      where: {phone}
    });
    Object.keys(landlordObj).forEach(item => {
      landlord[item] = landlordObj[item];
    });
    return await this.landlordModel.save(landlord);
  }

  /**
   * 通过房东id列表获取房东信息列表
   * @param LandlordIds
   */
  async getLandlordByIds(LandlordIds: Array<number>) {
    return await this.landlordModel.find({
      where: LandlordIds.map(id => ({id}))
    });
  }
}
