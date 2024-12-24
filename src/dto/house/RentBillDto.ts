import { Rule, RuleType } from '@midwayjs/validate';
const RuleNumRequired = RuleType.number().required();
const RuleStrRequired = RuleType.string().required();
export class AddRentBillReq {
  @Rule(RuleNumRequired)
  landlordId: number;

  @Rule(RuleNumRequired)
  tenantId: number;

  @Rule(RuleNumRequired)
  houseId: number;

  @Rule(RuleNumRequired)
  lastElectricityMeter: number;

  @Rule(RuleNumRequired)
  electricityMeter: number;

  @Rule(RuleNumRequired)
  lastWaterMeter: number;

  @Rule(RuleNumRequired)
  waterMeter: number;

  @Rule(RuleNumRequired)
  lastFuelMeter: number;

  @Rule(RuleNumRequired)
  fuelMeter: number;

  @Rule(RuleStrRequired)
  billDate: string;

  @Rule(RuleNumRequired)
  totalPrice: number
}

export class GetRentBillByLandlordIdReq {
  @Rule(RuleNumRequired)
  landlordId: number;
}

export class GetRentBillByTenantIdReq {
  @Rule(RuleNumRequired)
  tenantId: number;
}

export class GetRentBillByBillDateObjReq {
  @Rule(RuleNumRequired)
  landlordId: number;

  @Rule(RuleNumRequired)
  tenantId: number;

  @Rule(RuleNumRequired)
  houseId: number;

  @Rule(RuleStrRequired)
  billDate: string;
}
