// 手机号正则
const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/;

// 密码正则（密码必须包含字母和数字，且在6~18位之间，可以包含特殊字符）
const passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\s\S]{8,16}$/;

export class ValidateUtil {
  /**
   * 校验手机号
   * @param phone 手机号
   * @return 是否校验通过
   */
  static validatePhone(phone: string): boolean {
    return phoneReg.test(phone);
  }

  /**
   * 校验密码
   * @param password 密码
   */
  static validatePassword(password: string): boolean {
    return passwordReg.test(password);
  }
}
