import { OmitDto, Rule, RuleType } from '@midwayjs/validate';

const RuleNumEmp = RuleType.number().empty('');
const RuleStrEmp = RuleType.string().empty('');
const RuleNumRequire = RuleType.number().required();

class BaseAdminReq {

  /**
   * 手机号
   */
  @Rule(RuleType.string().length(11).required())
  phone: string;

  /**
   * 密码（更改时是旧密码）
   */
  @Rule(RuleType.string().empty(''))
  password: string;

  /**
   * 头像
   */
  @Rule(RuleType.string().empty(''))
  headImg: string;

  /**
   * 备注
   */
  @Rule(RuleType.string().empty(''))
  remark: string;
}

export class AddAdminReq extends BaseAdminReq {

  /**
   * 用户名
   */
  @Rule(RuleType.string().required())
  name: string;

  /**
   * 状态
   */
  @Rule(RuleType.number().empty())
  status: number;
}

export class LoginReq {
  /**
   * 手机号（账号）
   */
  @Rule(RuleType.string().length(11).required())
  phone: string;

  /**
   * 密码
   */
  @Rule(RuleType.string().required())
  password: string;
}

export class UpdateAdminReq {
  @Rule(RuleType.number().required())
  id: number;

  /**
   * 手机号
   */
  @Rule(RuleType.string().empty(''))
  phone: string;

  /**
   * 用户名
   */
  @Rule(RuleType.string().empty(''))
  name: string;

  @Rule(RuleType.string().empty(''))
  status: string;

  /**
   * 头像
   */
  @Rule(RuleType.string().empty(''))
  headImg: string;

  /**
   * 备注
   */
  @Rule(RuleType.string().empty(''))
  remark: string;
}

export class UpdateAdminSelfReq extends OmitDto(UpdateAdminReq, ['phone', 'status']) {

}


class UserBaseGet {
  @Rule(RuleNumEmp)
  id: number;

  @Rule(RuleStrEmp)
  name: string;

  @Rule(RuleStrEmp)
  phone: string;

  @Rule(RuleNumEmp)
  status: number;

  @Rule(RuleStrEmp)
  remark: string;

  @Rule(RuleNumRequire)
  current: number;

  @Rule(RuleNumRequire)
  pageSize: number;
}

export class GetLandlordReq extends UserBaseGet {
}

export class GetTenantReq extends UserBaseGet {
}

class BusinessBaseReq {
  @Rule(RuleNumEmp)
  id: number;

  @Rule(RuleNumEmp)
  houseId: number;

  @Rule(RuleNumEmp)
  landlordId: number;

  @Rule(RuleNumEmp)
  tenantId: number;

  @Rule(RuleNumEmp)
  status: number;

  @Rule(RuleNumRequire)
  current: number;

  @Rule(RuleNumRequire)
  pageSize: number;
}

export class GetReportReq extends BusinessBaseReq {
  @Rule(RuleStrEmp)
  reason: string;
}

export class GetCommentAdminReq extends BusinessBaseReq {
  @Rule(RuleNumEmp)
  houseScore: number;

  @Rule(RuleNumEmp)
  landlordScore: number;

  @Rule(RuleStrEmp)
  comment: string;
}

export class GetComplaintAdminReq {
  @Rule(RuleNumEmp)
  id: number;

  @Rule(RuleNumEmp)
  complaintId: number;

  @Rule(RuleNumEmp)
  identity: number;

  @Rule(RuleStrEmp)
  reason: string;

  @Rule(RuleNumEmp)
  status: number;

  @Rule(RuleNumRequire)
  current: number;

  @Rule(RuleNumRequire)
  pageSize: number;
}

export class UpdateComplaintAdminReq {
  @Rule(RuleNumRequire)
  id: number;

  @Rule(RuleNumRequire)
  status: number;
}

export class GetHouseAdminReq {
  @Rule(RuleNumRequire)
  current: number;

  @Rule(RuleNumRequire)
  pageSize: number;
}

export class GetAdminReq {
  @Rule(RuleNumEmp)
  id: number;

  @Rule(RuleStrEmp)
  name: string;

  @Rule(RuleStrEmp)
  phone: string;

  @Rule(RuleNumEmp)
  status: number;

  @Rule(RuleStrEmp)
  remark: string;

  @Rule(RuleNumRequire)
  current: number;

  @Rule(RuleNumRequire)
  pageSize: number;
}

export class UpdateHouseStatusReq {
  @Rule(RuleNumRequire)
  id: number;
  @Rule(RuleNumRequire)
  status: number;
}

export class UpdateLandlordStatusReq extends UpdateHouseStatusReq {
}

export class UpdateTenantStatusReq extends UpdateHouseStatusReq {
}