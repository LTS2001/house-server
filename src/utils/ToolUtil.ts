import { BusinessException } from '@/exception/BusinessException';
import { ResponseCode } from '@/common/ResponseFormat';
import { LANDLORD, TENANT } from '@/constant/userConstant';

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

  /**
   * WebSocket解析query参数
   * @param requestUrl 路径参数
   * @return identity 房东或者租客身份
   * @return id 房东或者租客id
   */
  static resolveWebSocketQuery(requestUrl: string) {
    const regex = new RegExp(`(?:\\?|&)(${TENANT}|${LANDLORD})=(\\d+)`);
    const [_, identity, id] = requestUrl.match(regex);
    return {
      identity,
      id
    };
  }

  static formatUtcTime(utcTime?: Date | null) {
    if (!utcTime) return;
    const d = new Date(utcTime);
    const year = d.getFullYear();
    let month: number | string = d.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    let day: number | string = d.getUTCDate();
    day = day < 10 ? '0' + day : day;
    let hours: number | string = d.getHours();
    hours = hours < 10 ? '0' + hours : hours;
    let minutes: number | string = d.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let seconds: number | string = d.getSeconds();
    seconds = seconds < 10 ? '0' + seconds : seconds;
    return `${ year }-${ month }-${ day } ${ hours }:${ minutes }:${ seconds }`;
  }
}