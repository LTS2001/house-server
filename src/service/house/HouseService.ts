import { Inject, Provide } from '@midwayjs/core';
import { AddressDao } from '@/dao/house/AddressDao';
import { HouseDao } from '@/dao/house/HouseDao';
import { houseAddressTableField, houseInfoTableField } from '@/constant/houseConstant';
import { Landlord } from '@/entities/Landlord';
import { AddHouseReq, GetHouseKeyWordReq, GetMarkHouseReq, UpdateHouseReq } from '@/dto/house/HouseDto';
import { HouseAddress } from '@/entities/HouseAddress';
import { House } from '@/entities/House';
import { IHouseInfo } from '@/typings/house/house';
import { ToolUtil } from '@/utils/ToolUtil';
import { LandlordDao } from '@/dao/user/LandlordDao';
import { GetHouseAdminReq } from '@/dto/user/AdminDto';

@Provide()
export class HouseService {
  @Inject()
  private addressDao: AddressDao;
  @Inject()
  private houseDao: HouseDao;
  @Inject()
  private landlordDao: LandlordDao;

  /**
   * 获取房屋详细信息通过两个id列表
   * @param twoIdList
   */
  async getHouseByTwoIdList(twoIdList: Array<{ houseId: number, landlordId: number }>) {
    // 查询房屋信息
    const houseList = await this.houseDao.getHouseByHouseIds(
      [...new Set(twoIdList.map(t => t.houseId))]
    );
    // 查询房东信息
    const landlordList = await this.landlordDao.getLandlordByIds(
      [...new Set(twoIdList.map(t => t.landlordId))]
    );
    // 查询房屋地址信息
    const addressList = await this.addressDao.getHouseAddress(
      [...new Set(houseList.map(house => house.addressId))]
    );

    return twoIdList.map((t) => {
      // 当前的房屋信息
      const house = JSON.parse(JSON.stringify(houseList.find(h => h.id === t.houseId))) as House;
      const houseId = house.id;
      const houseName = house.name;
      const houseImg = house.houseImg;
      delete house.id;
      delete house.name;
      delete house.houseImg;
      // 当前的房东信息
      const landlord = JSON.parse(JSON.stringify(landlordList.find(l => l.id === house.landlordId))) as Landlord;
      const landlordId = landlord.id;
      const landlordName = landlord.name;
      const landlordImg = landlord.headImg;
      const landlordPhone = landlord.phone;
      delete landlord.id;
      delete landlord.name;
      delete landlord.headImg;
      delete landlord.phone;
      // 当前的房屋地址信息
      const address = JSON.parse(JSON.stringify(addressList.find(a => a.id === house.addressId))) as HouseAddress;
      delete address.id;
      return {
        ...address,
        ...house,
        houseName,
        houseImg,
        ...landlord,
        landlordName,
        landlordImg,
        landlordPhone,
        landlordId,
        houseId
      };
    });

  }

  /**
   * 添加房屋信息
   * @param landlord 房东信息
   * @param house 房屋信息
   * @return houseInfo 对象实体
   */
  async addHouse(landlord: Landlord, houseObj: AddHouseReq) {
    // 处理house_address表字段
    const {addressDetail} = houseObj;
    const houseAddressTable = new HouseAddress();
    Object.keys(houseObj).forEach(key => {
      if (houseAddressTableField.includes(key))
        houseAddressTable[key] = houseObj[key];
    });
    const {provinceName, cityName, areaName, addressInfo} = ToolUtil.resolveAddress(addressDetail);
    houseAddressTable.provinceName = provinceName;
    houseAddressTable.cityName = cityName;
    houseAddressTable.areaName = areaName;
    houseAddressTable.addressInfo = addressInfo;
    // 添加房屋地址表数据
    const houseAddress = await this.addressDao.addHouseAddress(houseAddressTable);

    // 处理house_info表格的字段
    const houseTable = new House();
    Object.keys(houseObj).forEach(key => {
      if (houseInfoTableField.includes(key)) {
        houseTable[key] = houseObj[key];
      }
    });
    houseTable.landlordId = landlord.id;
    houseTable.addressId = houseAddress.id;
    // 添加房屋信息表数据
    const house = await this.houseDao.addHouse(houseTable);
    return house;
  }

  /**
   * 更新房屋信息
   * @param house 房屋更新信息
   * @return House 对象实体
   */
  async updateHouse(house: UpdateHouseReq) {
    // 处理house_address表字段
    const {addressDetail} = house;
    const houseAddressTable = new HouseAddress();
    Object.keys(house).forEach(key => {
      if (houseAddressTableField.includes(key))
        houseAddressTable[key] = house[key];
    });
    const {provinceName, cityName, areaName, addressInfo} = ToolUtil.resolveAddress(addressDetail);
    houseAddressTable.provinceName = provinceName;
    houseAddressTable.cityName = cityName;
    houseAddressTable.areaName = areaName;
    houseAddressTable.addressInfo = addressInfo;
    // 更新房屋地址信息
    const updateHouseAddress = await this.addressDao.updateHouseAddress(house.addressId, houseAddressTable);

    // 处理house表格的字段
    const houseInfoTable = new House();
    Object.keys(house).forEach(key => {
      if (houseInfoTableField.includes(key)) {
        houseInfoTable[key] = house[key];
      }
    });
    // 更新房屋信息
    const updateHouseInfo = await this.houseDao.updateHouse(house.houseId, houseInfoTable);
    const resultHouseInfos: IHouseInfo.IResultHouseInfos = {
      ...updateHouseInfo,
      ...updateHouseAddress,
      houseId: updateHouseInfo.id,
      addressId: updateHouseAddress.id,
    };

    return resultHouseInfos;
  }

  /**
   * 获取房屋信息
   * @param landlordId 房东id
   */
  async getHouse(landlordId: number) {
    const houseList = await this.houseDao.getHouseByLandlordIds([landlordId]);
    const houseAddressList = await this.addressDao.getHouseAddress(
      houseList.map(({addressId}) => addressId)
    );
    const houseArr = new Array<IHouseInfo.IResultHouseInfos>();
    houseList.forEach(item => {
        const obj: any = {
          ...houseAddressList.find(i => i.id === item.addressId),
          ...item,
          houseId: item.id,
          addressId: item.addressId
        };
        delete obj.id;
        houseArr.push(obj as IHouseInfo.IResultHouseInfos);
      }
    );
    return houseArr;
  }

  /**
   * 删除房屋图片
   * @param houseId 房屋id
   * @param imgName 图片名字
   */
  async delHouseImg(houseId: number, imgName: string) {
    // 获取房屋信息
    const [house] = await this.houseDao.getHouseByHouseIds([houseId]);
    house.houseImg = JSON.stringify(JSON.parse(house.houseImg).filter((i: string) => i !== imgName));
    // 保存房屋信息
    return await this.houseDao.updateHouse(houseId, house);
  }

  /**
   * 分页获取全部房屋
   */
  async getHouseByPage(getMarkHouseReq: GetMarkHouseReq) {
    const {minLat, minLng, maxLat, maxLng} = getMarkHouseReq;
    // 获取房屋信息通过房屋地址 id
    const houseList = await this.houseDao.getHouseByPage(minLat, minLng, maxLat, maxLng);
    const infoArr = new Array<IHouseInfo.IResultHouseInfos>();
    houseList.forEach(house => {
        const obj: any = {
          ...house.address,
          ...house,
          houseId: house.id,
        };
        delete obj.id;
        delete obj.address;
        infoArr.push(obj as IHouseInfo.IResultHouseInfos);
      }
    );
    return infoArr;
  }

  /**
   * 获取房屋通过关键字
   * @param getHouseReq
   */
  async getHouseByKeyword(getHouseReq: GetHouseKeyWordReq) {
    const {minLat, minLng, maxLat, maxLng} = getHouseReq;
    let keyword = getHouseReq.keyword || '';
    const houseList = await this.houseDao.getHouseByKeyword(minLat, minLng, maxLat, maxLng, keyword);
    const infoArr = new Array<IHouseInfo.IResultHouseInfos>();
    houseList.forEach(house => {
        delete house.landlord;
        const obj: any = {
          ...house.address,
          ...house,
          houseId: house.id,
        };
        delete obj.id;
        delete obj.address;
        infoArr.push(obj as IHouseInfo.IResultHouseInfos);
      }
    );
    return infoArr;
  }

  /**
   * 通过房屋id获取房屋列表
   * @param houseIdList
   */
  async getHouseListByHouseId(houseIdList: number[]) {
    return await this.houseDao.getHouseByHouseIds(houseIdList);
  }


  async getHouseByAdmin(getHouseReq: GetHouseAdminReq) {
    const houseList = await this.houseDao.getHouseByAdmin(getHouseReq);
    const addressList = await this.addressDao.getHouseAddress(houseList?.map(h => h.addressId));
    const landlordList = await this.landlordDao.getLandlordByIds(houseList?.map(h => h.landlordId));
    return houseList?.map(house => {
      const landlord = landlordList?.find(l => l.id === house.landlordId);
      return {
        ...addressList.find(a => a.id === house.addressId),
        ...house,
        landlordName: landlord?.name,
        landlordPhone: landlord?.phone
      };
    });
  }

  async updateHouseStatus(id: number, status: number) {
    return await this.houseDao.updateHouseStatus(id, status);
  }
}
