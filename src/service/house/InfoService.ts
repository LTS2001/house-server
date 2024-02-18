import {Inject, Provide} from "@midwayjs/core";
import {AddressDao} from "../../dao/house/AddressDao";
import {InfoDao} from "../../dao/house/InfoDao";
import {houseAddressTableField, houseInfoTableField} from "../../constant/houseConstant";
import {UserLandlord} from "../../entities/UserLandlord";
import {AddHouseReq} from "../../dto/house/info/AddHouseReq";
import {HouseAddress} from "../../entities/HouseAddress";
import {HouseInfo} from "../../entities/HouseInfo";

@Provide()
export class InfoService {
  @Inject()
  private addressDao: AddressDao;
  @Inject()
  private infoDao: InfoDao;

  /**
   * 添加房屋信息
   * @param user 用户信息
   * @param house 房屋信息
   * @return houseInfo 对象实体
   */
  async addHouseInfo(user: UserLandlord, house: AddHouseReq) {
    // 处理house_address表字段
    const {addressInfo} = house;
    const addressArr = addressInfo.split(/(省|市|区|县)/)
    const houseAddressTable = new HouseAddress();
    Object.keys(house).forEach(key => {
      if (houseAddressTableField.includes(key))
        houseAddressTable[key] = house[key];
    })
    houseAddressTable.provinceName = addressArr[0] + addressArr[1];
    houseAddressTable.cityName = addressArr[2] + addressArr[3];
    houseAddressTable.areaName = addressArr[4] + addressArr[5];
    houseAddressTable.addressInfo = addressArr[6];
    // 添加房屋地址表数据
    const houseAddress = await this.addressDao.addHouseAddress(houseAddressTable);

    // 处理house_info表格的字段
    const houseInfoTable = new HouseInfo();
    Object.keys(house).forEach(key => {
      if (houseInfoTableField.includes(key)) {
        houseInfoTable[key] = house[key];
      }
    })
    houseInfoTable.landlordId = user.id;
    houseInfoTable.addressId = houseAddress.id;
    // 添加房屋信息表数据
    const houseInfo = await this.infoDao.addHouseInfo(houseInfoTable);
    return houseInfo;
  }

  /**
   * 获取房屋信息
   * @param userId 用户id
   */
  async getHouseInfo(userId: number) {
    const houseInfos = await this.infoDao.getHouseInfo(userId);
    const houseAddresses = await this.addressDao.getHouseAddress(
      houseInfos.map(({addressId}) => addressId)
    )
    const infoArr = new Array<any>();
    houseInfos.forEach(item => {
      infoArr.push({...houseAddresses.find(i => i.id === item.addressId), ...item})
    })
    return infoArr;
  }
}
