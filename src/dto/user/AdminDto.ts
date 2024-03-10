import { Rule, RuleType } from '@midwayjs/validate';

class BaseAdminReq {

  /**
   * 手机号
   */
  @Rule(RuleType.string().length(11).required())
  phone: string;

  /**
   * 密码（更改时是旧密码）
   */
  @Rule(RuleType.string().required())
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
   * 确认密码
   */
  @Rule(RuleType.string().required())
  checkPassword: string;

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

export class UpdateAdminReq extends BaseAdminReq {
  /**
   * 用户名
   */
  @Rule(RuleType.string().empty(''))
  name: string;

  /**
   * 新密码
   */
  @Rule(RuleType.string().empty(''))
  newPassword: string;

  /**
   * 确认密码
   */
  @Rule(RuleType.string().empty(''))
  checkPassword: string;
}