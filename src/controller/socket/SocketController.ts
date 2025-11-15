import { OnWSConnection, WSController } from '@midwayjs/core';
import { Context } from '@midwayjs/ws';
import http from 'http';
import { ToolUtil } from '@/utils/ToolUtil';

/**
 * websocket
 */
@WSController('/')
export class SocketController {
  private static socketListInstance: Map<string, Context> = new Map();

  @OnWSConnection()
  async socketConnection(socket: Context, request: http.IncomingMessage) {
    const { identity, id } = ToolUtil.resolveWebSocketQuery(request.url);
    // 检查该用户是否已经连接
    const currentSocketInstance = SocketController.socketListInstance.get(
      `${identity},${id}`
    );
    if (currentSocketInstance) {
      currentSocketInstance.send(
        JSON.stringify({
          toIdentity: identity,
          toId: id,
          active: 'AlreadyConnected',
        })
      );
      return;
    }
    // 身份+id作为键存储当前客户端的链接
    SocketController.socketListInstance.set(`${identity},${id}`, socket);
    console.log(`${identity},${id}连接了socket`);

    socket.addEventListener('message', ({ data }) => {
      const { toIdentity, toId } = JSON.parse(data as string);
      // 获取目标socketInstance
      const currentSocketInstance = SocketController.socketListInstance.get(
        `${toIdentity},${toId}`
      );
      currentSocketInstance && currentSocketInstance.send(data);
    });

    socket.addEventListener('close', ({ target }) => {
      for (const [key, value] of SocketController.socketListInstance) {
        if (value === target) {
          console.log(`${key}断开了socket`);
          SocketController.socketListInstance.delete(key);
          break;
        }
      }
    });
    socket.send(
      JSON.stringify({
        toIdentity: identity,
        toId: id,
        active: 'Connect',
      })
    );
  }
}
