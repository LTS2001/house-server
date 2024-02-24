import {Provide} from "@midwayjs/core";
import {Repository} from "typeorm";
import {InjectEntityModel} from "@midwayjs/orm";
import {HouseInfo} from "../../entities/HouseInfo";

@Provide()
export class InfoDao {
  @InjectEntityModel(HouseInfo)
  private houseInfoModel: Repository<HouseInfo>;

  /**
   * 添加房屋信息
   * @param addHouseInfo 房屋信息
   * @return houseInfo 对象实体
   */
  async addHouseInfo(addHouseInfo: HouseInfo) {
    const houseInfo = new HouseInfo();
    Object.keys(addHouseInfo).forEach(key => {
      houseInfo[key] = addHouseInfo[key];
    })
    return await this.houseInfoModel.save(houseInfo);
  }

  /**
   * 更新房屋信息
   * @param houseInfo 房屋信息
   */
  async updateHouseInfo(houseInfo: HouseInfo) {
    return await this.houseInfoModel.save(houseInfo);
  }

  /**
   * 获取房屋信息通过用户id
   * @param userId 用户id
   * @return houseInfo 房屋信息
   */
  async getHouseInfoByUserId(userId: number) {
    return await this.houseInfoModel.find({
      where: {
        landlordId: userId,
      }
    })
  }

  /**
   * 获取房屋信息通过房屋id
   * @param houseIds 房屋id列表
   */
  async getHouseInfoByHouseIds(houseIds: number[]) {
    return await this.houseInfoModel.find({
      where: houseIds.map(id => ({id}))
    })
  }


}
