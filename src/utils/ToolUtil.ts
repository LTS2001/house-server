import { BusinessException } from '@/exception/BusinessException';
import { ResponseCode } from '@/common/ResponseFormat';

export class ToolUtil {
  /**
   * 解析地址
   * @param addressStr 需要解析的地址字符串
   */
  static resolveAddress(addressStr: string) {
    const addressArr = addressStr.match(/^(.*?[省市自治区壮回藏维吉])?(.*?[市区县])?(.*?[市区县])?(.*?)$/);
    if (!addressArr) throw new BusinessException(ResponseCode.PARAMS_ERROR, '地址格式错误！');
    return {
      provinceName: addressArr[1],
      cityName: addressArr[2],
      areaName: addressArr[3],
      addressInfo: addressArr[4],
    };
  }
}