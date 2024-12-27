import { Provide } from '@midwayjs/core';
import { subscribeResponse } from '@/utils/WechatOfficialUtil';
import { wechatAxios } from '@/request';
import { appletConfig } from '@/config/config.wechat';

interface AcceptWechatMsg {
  ToUserName: string;
  FromUserName: string;
  CreateTime: string;
  MsgType: 'text' | 'image' | 'event';
  // 发送消息时有
  MsgId?: string;
  // 关注/取消关注
  Event?: 'subscribe' | 'unsubscribe';
  // 图片
  PicUrl: string;
  MediaId: string;
  // 文字
  Content: string;
  [key: string]: any;
}

@Provide()
export class WechatService {
  async responseToWechat(msgObj: AcceptWechatMsg) {
    switch (msgObj.MsgType) {
      case 'event':
        if (msgObj.Event === 'subscribe') {
          return subscribeResponse();
        }
      case 'text':
        return this.textMessageHandle(msgObj.Content);
      case 'image':
        return {
          type: 'image',
          content: {
            mediaId: msgObj.MediaId,
          },
        };
    }
  }

  /**
   * 处理文字
   * @param textContent 文字内容
   */
  async textMessageHandle(textContent: string): Promise<string> {
    // await WechatOfficialUtil.uploadTemporary({
    //   type: 'image',
    //   path: 'https://litaosheng.top:10000/static/common/male.png',
    // });
    return textContent;
  }

  async imageMessageHandle() {}

  /**
   * 获取用户的openid
   * @param code 微信wx.login返回的code
   */
  async getUserOpenId(code: string) {
    const { appid, appSecret } = appletConfig;
    const data = await wechatAxios.get(
      `/sns/jscode2session?appid=${appid}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`
    );
    console.log(data);
  }
}
