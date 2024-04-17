import { Provide } from '@midwayjs/core';
import { Like, Repository } from 'typeorm';
import { InjectEntityModel } from '@midwayjs/orm';
import { House } from '@/entities/House';
import { HOUSE_FORRENT_RELEASED } from '@/constant/houseConstant';
import { GetHouseAdminReq } from '@/dto/user/AdminDto';

@Provide()
export class HouseDao {
  @InjectEntityModel(House)
  private houseModel: Repository<House>;

  /**
   * 添加房屋信息
   * @param addHouse 房屋信息
   * @return houseInfo 对象实体
   */
  async addHouse(addHouse: House) {
    const houseInfo = new House();
    Object.keys(addHouse).forEach(key => {
      houseInfo[key] = addHouse[key];
    });
    return await this.houseModel.save(houseInfo);
  }

  /**
   * 更新房屋信息
   * @param houseId 房屋id
   * @param houseObj 房屋信息
   */
  async updateHouse(houseId: number, houseObj: House) {
    const house = await this.houseModel.findOne({
      where: {id: houseId}
    });
    Object.keys(houseObj).forEach(key => {
      house[key] = houseObj[key];
    });
    return await this.houseModel.save(house);
  }

  /**
   * 获取房屋信息通过房东id
   * @param landlordIds 房东id列表
   * @return House 房屋信息
   */
  async getHouseByLandlordIds(landlordIds: number[]) {
    return await this.houseModel.find({
      where: landlordIds.map(landlordId => ({landlordId}))
    });
  }

  /**
   * 获取房屋信息通过房屋id
   * @param houseIds 房屋id列表
   */
  async getHouseByHouseIds(houseIds: number[]) {
    return await this.houseModel.find({
      where: houseIds.map(id => ({id}))
    });
  }

  /**
   * 分页获取房屋
   * @param minLat
   * @param minLng
   * @param maxLat
   * @param maxLng
   */
  async getHouseByPage(
    minLat: number,
    minLng: number,
    maxLat: number,
    maxLng: number
  ) {
    return await this.houseModel
      .createQueryBuilder('house')
      .leftJoinAndSelect('house.address', 'address')
      .where('address.latitude BETWEEN :minLat AND :maxLat', {minLat, maxLat})
      .andWhere('address.longitude BETWEEN :minLng AND :maxLng', {minLng, maxLng})
      .andWhere('house.status = :status', {status: HOUSE_FORRENT_RELEASED})
      .getMany();
  }

  async getHouseByKeyword(
    minLat: number,
    minLng: number,
    maxLat: number,
    maxLng: number,
    keyword: string
  ) {
    return await this.houseModel
      .createQueryBuilder('house')
      .leftJoinAndSelect('house.address', 'address')
      .leftJoinAndSelect('house.landlord', 'landlord')
      .where('address.latitude BETWEEN :minLat AND :maxLat', {minLat, maxLat})
      .andWhere('address.longitude BETWEEN :minLng AND :maxLng', {minLng, maxLng})
      .andWhere('house.status = :status', {status: HOUSE_FORRENT_RELEASED})
      .andWhere('(address.addressName LIKE :keyword OR landlord.name LIKE :keyword OR house.name LIKE :keyword)', {keyword: `%${ keyword }%`})
      .getMany();
  }


  async getHouseByAdmin(getHouseReq: GetHouseAdminReq) {
    const {current, pageSize} = getHouseReq;
    const obj: any = {};
    const equalArr = ['id', 'houseId', 'landlordId', 'tenantId', 'status'];
    const likeArr = ['reason'];
    Object.keys(getHouseReq).forEach(key => {
      if (equalArr.find(e => e === key)) {
        obj[key] = getHouseReq[key];
      }
      if (likeArr.find(l => l === key)) {
        obj[key] = Like(`%${ getHouseReq[key] }%`);
      }
    });
    return await this.houseModel.find({
      where: obj,
      order: {id: 'desc'},
      skip: current - 1,
      take: pageSize
    });
  }

  async updateHouseStatus(id: number, status: number) {
    const house = await this.houseModel.findOne({
      where: {id}
    });
    house.status = status;
    return await this.houseModel.save(house);
  }

}
