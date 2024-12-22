import { OmitDto, Rule, RuleType } from '@midwayjs/validate';

const RuleNumRequired = RuleType.number().required();

export class InitiateLeaseReq {
  @Rule(RuleNumRequired)
  houseId: number;

  @Rule(RuleNumRequired)
  landlordId: number;

  @Rule(RuleNumRequired)
  tenantId: number;

  @Rule(RuleType.number().empty(''))
  leaseMonths: number
}

export class GetLeaseReq extends OmitDto(InitiateLeaseReq, ['landlordId']) {

}

export class UpdateLeaseReq extends InitiateLeaseReq {
  @Rule(RuleNumRequired)
  status: number;
}