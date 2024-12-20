import { Rule, RuleType } from '@midwayjs/validate';

export class LoginLandlordReq {
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

export class LandlordDto {
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
   * 身份证姓名
   */
  @Rule(RuleType.string().empty(''))
  identityName: string;
  /**
   * 身份证性别
   */
  @Rule(RuleType.number().empty(''))
  identitySex: number;
  /**
   * 身份证民族
   */
  @Rule(RuleType.string().empty(''))
  identityNation: string;
  /**
   * 身份证出生日期
   */
  @Rule(RuleType.string().empty(''))
  identityBorn: string;
  /**
   * 身份证住址
   */
  @Rule(RuleType.string().empty(''))
  identityAddress: string;
  /**
   * 身份证号码
   */
  @Rule(RuleType.string().empty(''))
  identityNumber: string;
  /**
   * 身份证正反面照片
   */
  @Rule(RuleType.string().empty(''))
  identityImg: string;
}
