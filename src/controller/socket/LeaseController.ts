import { OnWSConnection, WSController } from '@midwayjs/core';
import { Context } from '@midwayjs/ws';
import * as http from 'http';
import { ToolUtil } from '@/utils/ToolUtil';

/**
 * 租赁时的websocket链接
 */
@WSController('/lease')
export class LeaseController {

  private static allSocketInstance: Map<string, Context> = new Map();
  @OnWSConnection()
  async leaseApplication(socket: Context, request: http.IncomingMessage) {
    const {identity, id} = ToolUtil.resolveWebSocketQuery(request.url);
    // 身份+id作为键存储当前客户端的链接
    LeaseController.allSocketInstance.set(`${ identity },${ id }`, socket);

    socket.addEventListener('message', ({data}) => {
      const {toIdentity, toId} = JSON.parse(data as string);
      // 获取目标socketInstance
      const currentSocketInstance = LeaseController.allSocketInstance.get(`${ toIdentity },${ toId }`);
      currentSocketInstance && currentSocketInstance.send(JSON.stringify({active: 'update'}));
    });

    socket.addEventListener('close', ({target}) => {
      for (const [key, value] of LeaseController.allSocketInstance) {
        if (value === target) {
          LeaseController.allSocketInstance.delete(key);
          break;
        }
      }
    });
    socket.send('lease socket is connected');
  }
}