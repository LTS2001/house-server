import { Rule, RuleType } from '@midwayjs/validate';

const RuleStrRequired = RuleType.string().required();
const RuleNumRequired = RuleType.number().required();

/**
 * 房屋基本请求
 */
class BaseHouseReq {
  @Rule(RuleStrRequired)
  name: string;

  @Rule(RuleNumRequired)
  price: number;

  @Rule(RuleStrRequired)
  houseImg: string;

  @Rule(RuleNumRequired)
  area: number;

  @Rule(RuleNumRequired)
  depositNumber: number;

  @Rule(RuleNumRequired)
  priceNumber: number;

  @Rule(RuleNumRequired)
  floor: number;

  @Rule(RuleNumRequired)
  toward: number;

  @Rule(RuleNumRequired)
  toilet: number;

  @Rule(RuleNumRequired)
  kitchen: number;

  @Rule(RuleNumRequired)
  balcony: number;

  @Rule(RuleNumRequired)
  waterFee: number;

  @Rule(RuleNumRequired)
  electricityFee: number;

  @Rule(RuleNumRequired)
  internetFee: number;

  @Rule(RuleNumRequired)
  fuelFee: number;

  @Rule(RuleStrRequired)
  addressName: string;

  @Rule(RuleStrRequired)
  addressDetail: string;

  @Rule(RuleNumRequired)
  latitude: number;

  @Rule(RuleNumRequired)
  longitude: number;

  @Rule(RuleType.string().allow(null))
  note: string;

  @Rule(RuleType.number().empty(''))
  parentId: number;

  @Rule(RuleType.number().empty(''))
  status: number;
}

/**
 * 添加房屋请求
 */
export class AddHouseReq extends BaseHouseReq {

}

/**
 * 更新房屋请求
 */
export class UpdateHouseReq extends BaseHouseReq {
  @Rule(RuleNumRequired)
  houseId: number;

  @Rule(RuleNumRequired)
  addressId: number;
}

export class GetMarkHouseReq {
  @Rule(RuleNumRequired)
  minLng: number;

  @Rule(RuleNumRequired)
  minLat: number;

  @Rule(RuleNumRequired)
  maxLng: number;

  @Rule(RuleNumRequired)
  maxLat: number;
}

export class GetHouseKeyWordReq extends GetMarkHouseReq {
  @Rule(RuleType.string().empty(''))
  keyword: string;
}
