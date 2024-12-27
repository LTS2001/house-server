import axios from 'axios';
import FormData from 'form-data';
import xml2js = require('xml2js');
import fs = require('fs');
import ejs = require('ejs');
import { config } from '../config/config.wechat';
const { appSecret, appid } = config;
const accessTokenPath = 'access_token.txt';

/**
 * 关注时响应模板
 */
const subscribeTemplate = [
  '欢迎关注LTS行间小筑公众号\n',
  '1、发送“某年某月账单”即可查询当月账单\n',
  '如：发送“2024年12月账单”即可查询2024年12月的租金账单\n',
  '2、发送“租赁合同”即可查询您所租赁的租房合同\n',
].join('');
export const subscribeResponse = ejs.compile(subscribeTemplate);

/*!
 * 响应模版
 */
/* eslint-disable indent */
const tpl = [
  '<xml>',
  '<ToUserName><![CDATA[<%-toUsername%>]]></ToUserName>',
  '<FromUserName><![CDATA[<%-fromUsername%>]]></FromUserName>',
  '<CreateTime><%=createTime%></CreateTime>',
  '<MsgType><![CDATA[<%=msgType%>]]></MsgType>',
  '<% if (msgType === "news") { %>',
  '<ArticleCount><%=content.length%></ArticleCount>',
  '<Articles>',
  '<% content.forEach(function(item){ %>',
  '<item>',
  '<Title><![CDATA[<%-item.title%>]]></Title>',
  '<Description><![CDATA[<%-item.description%>]]></Description>',
  '<PicUrl><![CDATA[<%-item.picUrl || item.picurl || item.pic || item.thumb_url %>]]></PicUrl>',
  '<Url><![CDATA[<%-item.url%>]]></Url>',
  '</item>',
  '<% }); %>',
  '</Articles>',
  '<% } else if (msgType === "music") { %>',
  '<Music>',
  '<Title><![CDATA[<%-content.title%>]]></Title>',
  '<Description><![CDATA[<%-content.description%>]]></Description>',
  '<MusicUrl><![CDATA[<%-content.musicUrl || content.url %>]]></MusicUrl>',
  '<HQMusicUrl><![CDATA[<%-content.hqMusicUrl || content.hqUrl %>]]></HQMusicUrl>',
  '</Music>',
  '<% } else if (msgType === "voice") { %>',
  '<Voice>',
  '<MediaId><![CDATA[<%-content.mediaId%>]]></MediaId>',
  '</Voice>',
  '<% } else if (msgType === "image") { %>',
  '<Image>',
  '<MediaId><![CDATA[<%-content.mediaId%>]]></MediaId>',
  '</Image>',
  '<% } else if (msgType === "video") { %>',
  '<Video>',
  '<MediaId><![CDATA[<%-content.mediaId%>]]></MediaId>',
  '<Title><![CDATA[<%-content.title%>]]></Title>',
  '<Description><![CDATA[<%-content.description%>]]></Description>',
  '</Video>',
  '<% } else if (msgType === "transfer_customer_service") { %>',
  '<% if (content && content.kfAccount) { %>',
  '<TransInfo>',
  '<KfAccount><![CDATA[<%-content.kfAccount%>]]></KfAccount>',
  '</TransInfo>',
  '<% } %>',
  '<% } else { %>',
  '<Content><![CDATA[<%-content%>]]></Content>',
  '<% } %>',
  '</xml>',
].join('');
/* eslint-enable indent */
const compiled = ejs.compile(tpl);

export class WechatOfficialUtil {
  /**
   * 转化xml格式的数据
   * @param xml xml格式数据
   */
  static parseXML(xml) {
    return new Promise((resolve, reject) => {
      xml2js.parseString(xml, { trim: true }, function (err, obj) {
        if (err) {
          return reject(err);
        }
        resolve(obj);
      });
    });
  }

  /**
   * 将xml2js解析出来的对象转换成直接可访问的对象
   * @param result
   */
  static formatMessage(result) {
    const message = {};
    if (typeof result === 'object') {
      for (let key in result) {
        if (!(result[key] instanceof Array) || result[key].length === 0) {
          continue;
        }
        if (result[key].length === 1) {
          let val = result[key][0];
          if (typeof val === 'object') {
            message[key] = this.formatMessage(val);
          } else {
            message[key] = (val || '').trim();
          }
        } else {
          message[key] = result[key].map(item => {
            return this.formatMessage(item);
          });
        }
      }
    }
    return message;
  }

  /*!
   * 将内容回复给微信的封装方法
   */
  static reply(content, fromUsername, toUsername) {
    const info: any = {};
    let type = 'text';
    info.content = content || '';
    if (Array.isArray(content)) {
      type = 'news';
    } else if (typeof content === 'object') {
      if (content.hasOwnProperty('type')) {
        if (content.type === 'customerService') {
          return this.reply2CustomerService(
            fromUsername,
            toUsername,
            content.kfAccount
          );
        }
        type = content.type;
        info.content = content.content;
      } else {
        type = 'music';
      }
    }
    info.msgType = type;
    info.createTime = new Date().getTime();
    info.toUsername = toUsername;
    info.fromUsername = fromUsername;
    return compiled(info);
  }

  static reply2CustomerService(fromUsername, toUsername, kfAccount) {
    const info: any = {};
    info.msgType = 'transfer_customer_service';
    info.createTime = new Date().getTime();
    info.toUsername = toUsername;
    info.fromUsername = fromUsername;
    info.content = {};
    if (typeof kfAccount === 'string') {
      info.content.kfAccount = kfAccount;
    }
    return compiled(info);
  }

  /**
   * 请求access_token
   */
  static async requestAccessToken() {
    const res: any = await axios.get(
      `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${appSecret}`
    );
    const tokenObj = {
      ...res.data,
      create_at: Math.floor(new Date().getTime() / 1000),
    };
    // 写入文件
    fs.writeFile(accessTokenPath, JSON.stringify(tokenObj), 'utf-8', err => {
      console.error(err);
    });
    return tokenObj.access_token;
  }

  /**
   * 获取access_token
   */
  static getAccessToken() {
    return new Promise(resolve => {
      fs.readFile(accessTokenPath, 'utf-8', async (err, data) => {
        if (err) {
          // 读取失败，一般说明该文件不存在。请求access_token
          console.error(err);
          return resolve(await this.requestAccessToken());
        } else {
          // 读取成功，还要验证是否过期，过期则重新请求并写入
          try {
            const { access_token, expires_in, create_at } = JSON.parse(data);
            // 是否有access_token
            if (!access_token) {
              return resolve(await this.requestAccessToken());
            }
            // 验证是否过期（过期前5分钟则请求）
            else if (
              new Date().getTime() / 1000 >=
              create_at + expires_in + 5 * 60
            ) {
              resolve(await this.requestAccessToken());
            } else {
              resolve(access_token);
            }
          } catch (error) {
            resolve(await this.requestAccessToken());
          }
        }
      });
    });
  }

  /**
   * 上传临时素材
   * @param type 临时素材的类型，图片（image）、语音（voice）、视频（video）和缩略图（thumb）
   * @param path 临时素材的路径
   */
  static async uploadTemporary({
    type,
    path,
  }: {
    type: 'image' | 'voice' | 'video' | 'thumb';
    path: string;
  }): Promise<string> {
    const accessToken = await this.getAccessToken();
    const form = new FormData();
    form.append('media', fs.createReadStream(path)); // 音频文件路径
    try {
      const response = await axios.post(
        `https://api.weixin.qq.com/cgi-bin/media/upload?access_token=${accessToken}&type=${type}`,
        form,
        {
          headers: {
            ...form.getHeaders(),
          },
        }
      );
      console.log('response', response);

      return '';
    } catch (error) {
      return '';
    }
  }
}
