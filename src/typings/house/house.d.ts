export declare namespace IHouseInfo {

  /**
   * 房屋的基本信息
   */
  interface IBaseHouseInfo {
    /**
     * 房屋名称
     */
    name: string;
    /**
     * 租金
     */
    price: number;
    /**
     * 房屋图片
     */
    houseImg: string;
    /**
     * 水费
     */
    waterFee: number;
    /**
     * 电费
     */
    electricityFee: number;
    /**
     * 网费
     */
    internetFee: number;
    /**
     * 燃气费
     */
    fuelFee: number;
    /**
     * 押金月数
     */
    depositNumber: number;
    /**
     * 付月数
     */
    priceNumber: number;
    /**
     * 房屋面积
     */
    area: number;
    /**
     * 楼层
     */
    floor: number;
    /**
     * 朝向 -> 1：东，2：西，3：南，4：北
     */
    toward: number;
    /**
     * 卫生间 -> 0：没有，1：独立，2：公用
     */
    toilet: number;
    /**
     * 厨房 -> 0：没有，1：独立，2：公用
     */
    kitchen: number;
    /**
     * 阳台 -> 1：有，0：没有
     */
    balcony: number;
    /**
     * 地址名称
     */
    addressName: string;
    /**
     * 详细地址（包括省、市、县）
     */
    addressDetail: string;
    /**
     * 备注
     */
    note?: string;
    /**
     * 状态 ->1：待租，2：已租，3：删除
     */
    status?: number;
  }

  /**
   * 返回给前端的数据类型
   */
  interface IResultHouseInfos extends Omit<IBaseHouseInfo, 'addressDetail'> {
    /**
     * 地址id
     */
    addressId: number;
    /**
     * 省名称
     */
    provinceName: string;
    /**
     * 市名称
     */
    cityName: string;
    /**
     * 区县名称
     */
    areaName: string;
    /**
     * 地址名称
     */
    addressName: string;
    /**
     * 详细地址
     */
    addressInfo: string;
    /**
     * 纬度
     */
    latitude: number;
    /**
     * 经度
     */
    longitude: number;
    /**
     * 房屋id
     */
    houseId: number;
    /**
     * 房东id
     */
    landlordId: number;
    /**
     * 创建时间
     */
    createdAt: Date;
    /**
     * 更新时间
     */
    updatedAt: Date;
  }
}
