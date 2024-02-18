import {Provide} from "@midwayjs/core";
import {InjectEntityModel} from "@midwayjs/orm";
import {Repository} from "typeorm";
import {HouseAddress} from "../../entities/HouseAddress";

@Provide()
export class AddressDao {
  @InjectEntityModel(HouseAddress)
  private houseAddressModel: Repository<HouseAddress>;

  /**
   * 添加房屋地址信息
   * @param addHouseAddress 房屋地址信息
   * @return houseAddress 对象实体
   */
  async addHouseAddress(addHouseAddress: HouseAddress) {
    const houseAddress = new HouseAddress();
    Object.keys(addHouseAddress).forEach(key => {
      houseAddress[key] = addHouseAddress[key];
    })
    return await this.houseAddressModel.save(houseAddress);
  }

  /**
   * 获取房屋地址信息
   * @param addressId 地址id
   */
  async getHouseAddress(addressId: number[]) {
    return await this.houseAddressModel.find({
      where: addressId.map(id => ({id}))
    })
  }

}
