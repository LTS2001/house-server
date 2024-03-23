import { OnWSConnection, WSController } from '@midwayjs/core';
import { Context } from '@midwayjs/ws';
import * as http from 'http';
import { ToolUtil } from '@/utils/ToolUtil';

/**
 * 报修时的websocket链接
 */
@WSController('/report')
export class ReportController {

  private static allSocketInstance: Map<string, Context> = new Map();

  @OnWSConnection()
  async reportConnection(socket: Context, request: http.IncomingMessage) {
    const {identity, id} = ToolUtil.resolveWebSocketQuery(request.url);
    // 身份+id作为键存储当前客户端的链接
    ReportController.allSocketInstance.set(`${ identity },${ id }`, socket);

    socket.addEventListener('message', ({data}) => {
      const {toIdentity, toId} = JSON.parse(data as string);
      // 获取目标socketInstance
      const currentSocketInstance = ReportController.allSocketInstance.get(`${ toIdentity },${ toId }`);
      currentSocketInstance && currentSocketInstance.send(JSON.stringify({active: 'update'}));
    });

    socket.addEventListener('close', ({target}) => {
      for (const [key, value] of ReportController.allSocketInstance) {
        if (value === target) {
          ReportController.allSocketInstance.delete(key);
          break;
        }
      }
    });
    socket.send('lease socket is connected');
  }
}