import {Rule, RuleType} from "@midwayjs/validate";

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
}
