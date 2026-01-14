import { Rule, RuleType } from '@midwayjs/validate';
const RuleNum = RuleType.number().empty();
const RuleStr = RuleType.string().empty();
export class AddRentBillReq {
  @Rule(RuleNum)
  landlordId: number;

  @Rule(RuleNum)
  tenantId: number;

  @Rule(RuleNum)
  houseId: number;

  @Rule(RuleNum)
  lastElectricityMeter: number;

  @Rule(RuleNum)
  electricityMeter: number;

  @Rule(RuleNum)
  lastWaterMeter: number;

  @Rule(RuleNum)
  waterMeter: number;

  @Rule(RuleNum)
  lastFuelMeter: number;

  @Rule(RuleNum)
  fuelMeter: number;

  @Rule(RuleStr)
  billDate: string;

  @Rule(RuleNum)
  totalPrice: number;
}

export class GetRentBillByLandlordIdReq {
  @Rule(RuleNum)
  landlordId: number;
}

export class GetRentBillByTenantIdReq {
  @Rule(RuleNum)
  tenantId: number;
}

export class GetRentBillByBillDateObjReq {
  @Rule(RuleNum)
  landlordId: number;

  @Rule(RuleNum)
  tenantId: number;

  @Rule(RuleNum)
  houseId: number;

  @Rule(RuleStr)
  billDate: string;
}
