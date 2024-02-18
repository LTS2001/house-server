import {RuleType, Rule} from '@midwayjs/validate';

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
