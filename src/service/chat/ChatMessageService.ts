import { Inject, Provide } from '@midwayjs/core';
import { ChatMessageDao } from '@/dao/chat/ChatMessageDao';
import { AddChatMessageReq, GetChatMessageReq } from '@/dto/chat/ChatDto';
import { ChatMessage } from '@/entities/ChatMessage';
import { ChatSessionDao } from '@/dao/chat/ChatSessionDao';
import { ChatSession } from '@/entities/ChatSession';

@Provide()
export class ChatMessageService {
  @Inject()
  private chatMessageDao: ChatMessageDao;
  @Inject()
  private chatSessionDao: ChatSessionDao;

  /**
   * 添加一个聊天信息
   * @param chatMessage
   */
  async addChatMessage(chatMessage: AddChatMessageReq) {
    const {sessionId, senderId, receiverId, content, type} = chatMessage;
    // 更新会话日期
    const session = new ChatSession();
    session.updatedAt = new Date();
    this.chatSessionDao.updateChatSessionBySessionId(sessionId, session).then();
    // 添加一个信息
    const message = new ChatMessage();
    message.sessionId = sessionId;
    message.senderId = senderId;
    message.receiverId = receiverId;
    message.content = content;
    message.type = type;
    return await this.chatMessageDao.addChatMessage(message);
  }

  /**
   * 获取聊天记录
   * @param chatMessage
   */
  async getChatMessage(chatMessage: GetChatMessageReq) {
    const {senderId, receiverId, page, limit} = chatMessage;
    // 获取 sender 和 receiver 之间的正常的会话列表（两个）
    const sessionNormal = await this.chatSessionDao.getChatSessionBetweenSenderAndReceiverBySenderId(senderId, receiverId);
    // 查看是否有sender的会话，否则直接返回空数组
    if (sessionNormal.find(s => s.senderId === senderId)) {
      const res = await this.chatMessageDao.getChatMessage(senderId, receiverId, page, limit, sessionNormal.map(
        s => ({sessionId: s.id, senderId: s.senderId, receiverId: s.receiverId})
      ));
      res.reverse();
      return res;
    } else {
      return [];
    }
  }

  /**
   * 获取会话列表的最新一条消息
   * @param senderId
   */
  async getChatSessionLastOneMessageList(senderId: string) {
    // 获取 sender 作为接收者或者发送者的会话列表（sender 和同一个 receiver 有两个 session 会话记录）
    const sessionList = await this.chatSessionDao.getChatSessionWorkSenderAndReceiver(senderId);
    if (!sessionList.length) return [];
    // 筛选出 sender 和同一个 receiver 中最新的 session 记录
    const lastSessionList: ChatSession[] = [];
    sessionList.forEach(normal => {
      const isExist = lastSessionList.find(last => {
        if (last.senderId === normal.senderId && last.receiverId === normal.receiverId) {
          return true;
        } else if (last.senderId === normal.receiverId && last.receiverId === normal.senderId) {
          return true;
        } else {
          return false;
        }
      });
      if (!isExist) {
        lastSessionList.push(normal);
      }
    });

    return await this.chatMessageDao.getChatSessionLastOneMessageList(lastSessionList?.map(l => l.id));
  }
}