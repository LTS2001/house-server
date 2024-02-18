import {Rule, RuleType} from "@midwayjs/validate";

const RuleString = RuleType.string();
const RuleNumber = RuleType.number();

export class AddHouseReq {

  @Rule(RuleString)
  name: string;

  @Rule(RuleNumber)
  area: number;

  @Rule(RuleNumber)
  price: number;

  @Rule(RuleNumber)
  depositNumber: number;

  @Rule(RuleNumber)
  priceNumber: number;

  @Rule(RuleNumber)
  floor: number;

  @Rule(RuleNumber)
  toward: number;

  @Rule(RuleNumber)
  toilet: number;

  @Rule(RuleNumber)
  kitchen: number;

  @Rule(RuleNumber)
  balcony: number;

  @Rule(RuleNumber)
  waterFee: number;

  @Rule(RuleNumber)
  electricityFee: number;

  @Rule(RuleNumber)
  internetFee: number;

  @Rule(RuleNumber)
  fuelFee: number;

  @Rule(RuleString.empty(''))
  note: string;

  @Rule(RuleString)
  addressName: string;

  @Rule(RuleString)
  addressInfo: string;

  @Rule(RuleNumber)
  latitude: number;

  @Rule(RuleNumber)
  longitude: number;

  @Rule(RuleString)
  headImg: string;
}
