import {Rule, RuleType} from "@midwayjs/validate";

export class UpdateUserReq {
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

  /**
   * 手机号
   */
  @Rule(RuleType.string().length(11).required())
  phone: string;

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

  /**
   * 头像
   */
  @Rule(RuleType.string().empty(''))
  headImg: string;

}
