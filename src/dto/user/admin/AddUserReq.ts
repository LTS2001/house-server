import {Rule, RuleType} from "@midwayjs/validate";

export class AddUserReq {

  /**
   * 用户名
   */
  @Rule(RuleType.string().required())
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
   * 密码
   */
  @Rule(RuleType.string().required())
  password: string;

  /**
   * 确认密码
   */
  @Rule(RuleType.string().required())
  checkPassword: string;

  /**
   * 头像
   */
  @Rule(RuleType.string().empty(''))
  headImg: string;
}
