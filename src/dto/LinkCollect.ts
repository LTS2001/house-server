import { Rule, RuleType } from '@midwayjs/validate';

const RuleNumRequired = RuleType.number().required();

export class AddCollectReq {
  @Rule(RuleNumRequired)
  houseId: number;

  @Rule(RuleNumRequired)
  tenantId: number;

  @Rule(RuleNumRequired)
  status: number;
}

export class GetCollectReq {
  @Rule(RuleNumRequired)
  houseId: number;

  @Rule(RuleNumRequired)
  tenantId: number;
}