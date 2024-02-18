import CryptoJS from 'crypto-js';

const CRYPTO_KEY: string = "MY_HOUSE_SERVER";

export class CryptoUtil {
  /**
   * 字符串加密
   * @param str 需要加密的字符串
   * @return str 加密后的字符串
   */
  static encryptStr(str: string) {
    return CryptoJS.AES.encrypt(str, CRYPTO_KEY).toString();
  }

  /**
   * 字符串解密
   * @param str 需要解密的字符串
   * @return str 解密后的字符串
   */
  static decryptStr(str: string) {
    return CryptoJS.AES.decrypt(str, CRYPTO_KEY).toString(CryptoJS.enc.Utf8);
  }
}



