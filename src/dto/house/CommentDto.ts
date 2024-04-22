import { Rule, RuleType } from '@midwayjs/validate';

const RuleStrRequired = RuleType.string().required();
const RuleNumRequired = RuleType.number().required();

export class AddCommentReq {
  @Rule(RuleNumRequired)
  houseId: number;
  @Rule(RuleNumRequired)
  landlordId: number;
  @Rule(RuleNumRequired)
  tenantId: number;
  @Rule(RuleNumRequired)
  leaseId: number;
  @Rule(RuleNumRequired)
  houseScore: number;
  @Rule(RuleNumRequired)
  landlordScore: number;
  @Rule(RuleStrRequired)
  comment: string;
  @Rule(RuleStrRequired)
  image: string;
}

export class GetCommentReq {
  @Rule(RuleNumRequired)
  houseId: number;
  @Rule(RuleNumRequired)
  tenantId: number;
}

export class UpdateCommentReq {
  @Rule(RuleNumRequired)
  id: number;
  @Rule(RuleNumRequired)
  status: number;
}