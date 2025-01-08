import FormData from 'form-data';
import puppeteer from 'puppeteer';
import xml2js = require('xml2js');
import fs = require('fs');
import ejs = require('ejs');
import { officialConfig } from '../config/config.wechat';
import { wechatAxios } from '@/request';
import { TemplateUtil } from './TemplateUtil';
const { appSecret, appid } = officialConfig;
const accessTokenPath = 'access_token.txt';

/**
 * 关注时响应模板
 */
export const subscribeResponse = ejs.compile(
  TemplateUtil.getSubscribeTemplate()
);

/*!
 * 响应模版
 */
const compiled = ejs.compile(TemplateUtil.getWechatResponseXMLTemplate());

export class WechatUtil {
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
    const res: any = await wechatAxios.get(
      `/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${appSecret}`
    );
    const tokenObj = {
      ...res,
      create_at: Math.floor(new Date().getTime() / 1000),
    };
    // 写入文件
    fs.writeFile(accessTokenPath, JSON.stringify(tokenObj), 'utf-8', err => {
      if (err) {
        console.error('access_token写入错误', err);
      }
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
      const response = await wechatAxios.post(
        `/cgi-bin/media/upload?access_token=${accessToken}&type=${type}`,
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

  /**
   * 生成pdf
   * @param data 数据
   * @param filePath 生成文件的路径
   */
  static async generateRentBillPDF(data, filePath) {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    // 构建 HTML 模板
    const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { text-align: center; }
          .bill { margin: 20px 0; }
        </style>
      </head>
      <body>
        <h1>房租账单</h1>
        <div class="bill">
          <p>租户姓名: ${data.date}</p>
        </div>
        <p style="text-align: center;">感谢您的及时付款！</p>
      </body>
    </html>
  `;

    await page.setContent(htmlContent);
    await page.pdf({ path: filePath, format: 'A4' });

    await browser.close();
  }

  /**
   * 生成图片
   * @param data 数据
   * @param filePath 生成图片的路径
   */
  static async generateRentBillPNG(data: any, filePath: string) {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    // 构建 HTML 模板
    const htmlContent = TemplateUtil.getBillTemplate(data);

    await page.setContent(htmlContent);
    await page.screenshot({
      path: filePath,
      clip: {
        x: 0,
        y: 0,
        width: 890,
        height: 580,
      },
    });

    await browser.close();
  }
}
