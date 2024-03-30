import { OnWSConnection, WSController } from '@midwayjs/core';
import { Context } from '@midwayjs/ws';
import http from 'http';
import { ToolUtil } from '@/utils/ToolUtil';

/**
 * 聊天socket
 */
@WSController('/chat')
export class ChatController {
  private static allSocketInstance: Map<string, Context> = new Map();

  @OnWSConnection()
  async chatConnection(socket: Context, request: http.IncomingMessage) {
    const {identity, id} = ToolUtil.resolveWebSocketQuery(request.url);
    // 身份+id作为键存储当前客户端的链接
    ChatController.allSocketInstance.set(`${ identity },${ id }`, socket);

    socket.addEventListener('message', ({data}) => {
      const {toIdentity, toId} = JSON.parse(data as string);
      // 获取目标socketInstance
      const currentSocketInstance = ChatController.allSocketInstance.get(`${ toIdentity },${ toId }`);
      currentSocketInstance && currentSocketInstance.send(JSON.stringify({active: 'update'}));
    });

    socket.addEventListener('close', ({target}) => {
      for (const [key, value] of ChatController.allSocketInstance) {
        if (value === target) {
          ChatController.allSocketInstance.delete(key);
          break;
        }
      }
    });
    socket.send('chat socket is connected');
  }
}
