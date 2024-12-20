import { USER_STATUS_NORMAL } from '@/constant/userConstant';
import { Landlord } from '@/entities/Landlord';
import { Tenant } from '@/entities/Tenant';

export class InfoFilterUtil {
  /**
   * 过滤用户的敏感信息（房东、租客）
   * @param userInfo 用户信息
   */
  static filterUserSensitive(userInfo: Landlord | Tenant) {
    const { phone, identityName, identityNumber, identityAddress } = userInfo;
    // 删除密码
    delete userInfo.password;
    // 删除身份证生日
    delete userInfo.identityBorn;
    // 删除身份证照片
    delete userInfo.identityImg;
    // 处理手机号码
    userInfo.phone = `${phone.slice(0, 2)}****${phone.slice(phone.length - 2)}`;
    // 若已实名则处理身份证信息
    if (userInfo.status === USER_STATUS_NORMAL) {
      // 处理身份证姓名
      userInfo.identityName = `${identityName[0]}*${
        identityName[identityName.length - 1]
      }`;
      // 处理身份证号码
      userInfo.identityNumber = `${identityNumber.slice(
        0,
        2
      )}****${identityNumber.slice(identityNumber.length - 2)}`;
      // 处理身份证地址
      userInfo.identityAddress = `${identityAddress.slice(
        0,
        2
      )}****${identityAddress.slice(identityAddress.length - 2)}`;
    }
  }
}
