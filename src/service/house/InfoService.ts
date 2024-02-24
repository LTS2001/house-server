import {Inject, Provide} from "@midwayjs/core";
import {AddressDao} from "../../dao/house/AddressDao";
import {InfoDao} from "../../dao/house/InfoDao";
import {houseAddressTableField, houseInfoTableField} from "../../constant/houseConstant";
import {UserLandlord} from "../../entities/UserLandlord";
import {AddHouseReq, UpdateHouseReq} from "../../dto/HouseInfo";
import {HouseAddress} from "../../entities/HouseAddress";
import {HouseInfo} from "../../entities/HouseInfo";
import {IHouseInfo} from "../../typings/house/info";
import {BusinessException} from "../../exception/BusinessException";
import {ResponseCode} from "../../common/ResponseFormat";

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
    const {addressDetail} = house;
    const addressArr = addressDetail.split(/(省|市|区|县)/)
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
   * 更新房屋信息
   * @param house 房屋更新信息
   * @return houseInfo 对象实体
   */
  async updateHouseInfo(house: UpdateHouseReq) {
    // 处理house_address表字段
    const {addressDetail} = house;
    const houseAddressTable = new HouseAddress();
    Object.keys(house).forEach(key => {
      if (houseAddressTableField.includes(key))
        houseAddressTable[key] = house[key];
    })
    const addressArr = addressDetail.match(/^(.*?[省市自治区壮回藏维吉])?(.*?[市区县])?(.*?[市区县])?(.*?)$/);
    if (!addressArr) throw new BusinessException(ResponseCode.PARAMS_ERROR, '地址格式错误！');
    houseAddressTable.provinceName = addressArr[1];
    houseAddressTable.cityName = addressArr[2];
    houseAddressTable.areaName = addressArr[3];
    houseAddressTable.addressInfo = addressArr[4];
    // 查询房屋地址信息
    const [houseAddress] = await this.addressDao.getHouseAddress([house.addressId]);
    // 更新房屋地址信息
    const updateHouseAddress = await this.addressDao.updateHouseAddress({...houseAddress, ...houseAddressTable});
    // 处理house_info表格的字段
    const houseInfoTable = new HouseInfo();
    Object.keys(house).forEach(key => {
      if (houseInfoTableField.includes(key)) {
        houseInfoTable[key] = house[key];
      }
    })
    // 查询房屋信息
    const [houseInfo] = await this.infoDao.getHouseInfoByHouseIds([house.houseId]);
    // 更新房屋信息
    const updateHouseInfo = await this.infoDao.updateHouseInfo({...houseInfo, ...houseInfoTable});
    const resultHouseInfos: IHouseInfo.IResultHouseInfos = {
      ...updateHouseInfo,
      ...updateHouseAddress,
      houseId: updateHouseInfo.id,
      addressId: updateHouseAddress.id,
    }

    return resultHouseInfos;
  }

  /**
   * 获取房屋信息
   * @param userId 用户id
   */
  async getHouseInfo(userId: number) {
    const houseInfos = await this.infoDao.getHouseInfoByUserId(userId);
    const houseAddresses = await this.addressDao.getHouseAddress(
      houseInfos.map(({addressId}) => addressId)
    )
    const infoArr = new Array<IHouseInfo.IResultHouseInfos>();
    houseInfos.forEach(item => {
      const obj: any = {
        ...houseAddresses.find(i => i.id === item.addressId),
        ...item,
        houseId: item.id,
        addressId: item.addressId
      }
      delete obj.id;
      infoArr.push(obj as IHouseInfo.IResultHouseInfos);
    })
    return infoArr;
  }

  /**
   * 删除房屋图片
   * @param houseId 房屋id
   * @param imgName 图片名字
   */
  async delHouseImg(houseId: number, imgName: string) {
    // 获取房屋信息
    const [houseInfo] = await this.infoDao.getHouseInfoByHouseIds([houseId]);
    houseInfo.headImg = JSON.stringify(JSON.parse(houseInfo.headImg).filter((i: string) => i !== imgName));
    // 保存房屋信息
    return await this.infoDao.updateHouseInfo(houseInfo);
  }
}
