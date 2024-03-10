import { Rule, RuleType } from '@midwayjs/validate';

const RuleNumRequired = RuleType.number().required();
const RuleStrRequired = RuleType.string().required();

export class AddReportReq {
  @Rule(RuleNumRequired)
  houseId: number;

  @Rule(RuleNumRequired)
  landlordId: number;

  @Rule(RuleStrRequired)
  reason: string;

  @Rule(RuleStrRequired)
  image: string;

  @Rule(RuleStrRequired)
  video: string;
}