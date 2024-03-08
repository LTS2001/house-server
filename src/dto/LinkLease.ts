import { Rule, RuleType } from '@midwayjs/validate';

const RuleNumRequired = RuleType.number().required();

export class AddLeaseReq {
  @Rule(RuleNumRequired)
  houseId: number;
  @Rule(RuleNumRequired)
  tenantId: number;
}

export class GetLeaseReq extends AddLeaseReq {

}