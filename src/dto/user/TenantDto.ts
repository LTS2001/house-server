import { Rule, RuleType } from '@midwayjs/validate';

export class LoginTenantReq {
  /**
   * 手机号
   */
  @Rule(RuleType.string().required())
  phone: string;

  /**
   * 密码
   */
  @Rule(RuleType.string().required())
  password: string;
}

export class UpdateTenantReq {

  /**
   * 用户名
   */
  @Rule(RuleType.string().empty(''))
  name: string;

  /**
   * 备注
   */
  @Rule(RuleType.string().empty(''))
  remark: string;
}
