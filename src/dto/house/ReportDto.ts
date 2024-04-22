import { Rule, RuleType } from '@midwayjs/validate';

const RuleNumRequired = RuleType.number().required();
const RuleStrRequired = RuleType.string().required();

export class AddReportReq {
  @Rule(RuleNumRequired)
  houseId: number;

  @Rule(RuleNumRequired)
  landlordId: number;

  @Rule(RuleNumRequired)
  tenantId: number;

  @Rule(RuleStrRequired)
  reason: string;

  @Rule(RuleType.string().empty(''))
  image: string;

  @Rule(RuleType.string().empty(''))
  video: string;
}

export class UpdateReportReq {
  @Rule(RuleNumRequired)
  reportId: number;

  @Rule(RuleNumRequired)
  status: number;
}