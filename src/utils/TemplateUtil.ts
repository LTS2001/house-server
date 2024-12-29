import { RentBill } from '@/entities/RentBill';

export class TemplateUtil {
  /**
   * 获取返回给微信服务器的模板
   */
  static getWechatResponseXMLTemplate() {
    return [
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
  }

  /**
   * 获取公众号被关注时的模板
   */
  static getSubscribeTemplate() {
    return [
      '欢迎关注LTS行间小筑公众号\n',
      '1、发送“某年某月账单”即可查询当月账单\n',
      '如：发送“2024年12月账单”即可查询2024年12月的租金账单\n',
      '2、发送“租赁合同”即可查询您所租赁的租房合同\n',
    ].join('');
  }

  /**
   * 获取账单的html模板
   * @param data
   */
  static getBillTemplate(
    data: RentBill & {
      tenantName: string;
      landlordName: string;
      houseName: string;
      housePrice: number;
      fuelFee: number;
      electricityFee: number;
      waterFee: number;
    }
  ) {
    const {
      tenantName,
      landlordName,
      totalPrice,
      houseName,
      billDate,
      lastWaterMeter,
      lastElectricityMeter,
      lastFuelMeter,
      waterMeter,
      electricityMeter,
      fuelMeter,
      housePrice,
      fuelFee,
      electricityFee,
      waterFee,
      id,
    } = data;
    return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>房租、水、电费（专用）收据</title>
        <style>
          body {
            margin: 20px;
          }
          .receipt {
            position: relative;
            width: 800px;
            border: 1px solid black;
            padding: 10px 24px;
            background-color: #fff9ff;
          }
          .title {
            margin: 5px 0 20px;
            text-align: center;
            font-weight: bold;
            font-size: 24px;
          }
          .number {
            color: #ac2b30;
          }
          .number-wrap {
            position: absolute;
            top: 25px;
            right: 16px;
            text-align: right;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          table,
          th,
          td {
            border: 1px solid black;
          }
          th,
          td {
            padding: 10px;
            text-align: center;
          }
          .footer {
            margin-top: 10px;
            display: flex;
            justify-content: space-between;
          }
          .footer div {
            margin: 10px;
            font-size: 16px;
          }
          .price {
            font-weight: bold;
            color: #e93a40;
            font-size: 20px;
            text-decoration: underline;
          }
          .landlord-name {
            font-size: 20px;
            font-weight: bold;
          }
          .tenant-wrap {
            display: flex;
            justify-content: space-between;
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="title">房租、水、电费（专用）收据</div>
          <div class="number-wrap">
            <span>No.</span>
            <span class="number">${id}</span>
          </div>
          <div class="tenant-wrap">
            <div>用户名：<span>${tenantName}</span></div>
            <div>房屋：<span>${houseName}</span></div>
            <div>${billDate}</div>
          </div>
          <table>
            <tr>
              <th>项目</th>
              <th>上月</th>
              <th>本月</th>
              <th>实用</th>
              <th>单位</th>
              <th colspan="5">金额</th>
              <th>备注</th>
            </tr>
            <tr>
              <td>水费（吨）</td>
              <td>${lastWaterMeter}</td>
              <td>${waterMeter}</td>
              <td>${waterMeter - lastWaterMeter}</td>
              <td>吨</td>
              <td colspan="5">${waterFee * (waterMeter - lastWaterMeter)}</td>
              <td></td>
            </tr>
            <tr>
              <td>电费（度）</td>
              <td>${lastElectricityMeter}</td>
              <td>${electricityMeter}</td>
              <td>${electricityMeter - lastElectricityMeter}</td>
              <td>度</td>
              <td colspan="5">${
                electricityFee * (electricityMeter - lastElectricityMeter)
              }</td>
              <td></td>
            </tr>
            <tr>
              <td>燃气费（m³）</td>
              <td>${lastFuelMeter}</td>
              <td>${fuelMeter}</td>
              <td>${fuelMeter - lastFuelMeter}</td>
              <td>m³</td>
              <td colspan="5">${fuelFee * (fuelMeter - lastFuelMeter)}</td>
              <td></td>
            </tr>
            <tr>
              <td>房租</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td colspan="5">${housePrice}</td>
              <td></td>
            </tr>
            <tr>
              <td>卫生费</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td colspan="5"></td>
              <td></td>
            </tr>
            <tr>
              <td>管理费</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td colspan="5"></td>
              <td></td>
            </tr>
            <tr>
              <td>其他</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td colspan="5"></td>
              <td></td>
            </tr>
          </table>

          <div class="footer">
            <div>合计人民币：<span class="price">${totalPrice}元</span></div>
            <div>收款人：<span class="landlord-name">${landlordName}</span></div>
          </div>
        </div>
      </body>
    </html>
    `;
  }
}
