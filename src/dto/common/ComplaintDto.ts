import { Rule, RuleType } from '@midwayjs/validate';

const RuleNumRequired = RuleType.number().required();
const RuleStrRequired = RuleType.string().required();

class BaseComplaint {
  @Rule(RuleNumRequired)
  complaintId: number;

  @Rule(RuleNumRequired)
  identity: number;
}

export class AddComplaintReq extends BaseComplaint {
  @Rule(RuleStrRequired)
  reason: string;

  @Rule(RuleStrRequired)
  image: string;

  @Rule(RuleStrRequired)
  video: string;
}

export class GetComplaintReq extends BaseComplaint {
}