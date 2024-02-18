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
   * 获取房屋信息
   * @param userId 用户id
   * @return houseInfo 房屋信息
   */
  async getHouseInfo(userId: number) {
    return await this.houseInfoModel.find({
      where: {
        landlordId: userId,
      }
    })
  }
}
