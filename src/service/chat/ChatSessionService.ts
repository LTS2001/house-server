import { Inject, Provide } from '@midwayjs/core';
import { ChatSessionDao } from '@/dao/chat/ChatSessionDao';
import { ChatSession } from '@/entities/ChatSession';
import { LeaveChatSessionReq } from '@/dto/chat/ChatDto';
import { ChatMessageDao } from '@/dao/chat/ChatMessageDao';

@Provide()
export class ChatSessionService {
  @Inject()
  private chatSessionDao: ChatSessionDao;

  /**
   * 添加一个聊天会话
   * @param senderId 发送者id
   * @param receiverId 接收者id
   */
  async addChatSession(senderId: string, receiverId: string) {
    // 查看该 senderId 和 receiverId 之间的聊天会话是否存在
    const chatSessionList = await this.chatSessionDao.getChatSessionBetweenSenderAndReceiverBySenderId(senderId, receiverId);
    // 查看 senderId 的会话列表是否正常（会话列表至多一个是正常的）
    const senderNormalSession = chatSessionList.find(c => c.senderId === senderId);
    // 查看 receiverId 的会话列表是否正常（会话列表至多一个是正常的）
    const receiverNormalSession = chatSessionList.find(c => c.senderId === receiverId);

    // 添加 receiver -> sender 的会话
    if (!receiverNormalSession) {
      const chatSession = new ChatSession();
      chatSession.senderId = receiverId;
      chatSession.receiverId = senderId;
      await this.chatSessionDao.addChatSession(chatSession);
    }

    // 添加 sender -> receiver 的会话
    if (!senderNormalSession) {
      const chatSession = new ChatSession();
      chatSession.senderId = senderId;
      chatSession.receiverId = receiverId;
      return await this.chatSessionDao.addChatSession(chatSession);
    } else {
      return senderNormalSession;
    }
  }

  /**
   * 获取会话列表
   * @param senderId
   */
  async getChatSession(senderId: string) {
    // 查询 senderId 的所有正常的 session 列表
    return await this.chatSessionDao.getChatSessionBySenderId(senderId);
  }

  /**
   * 离开会话
   * @param chat
   */
  async leaveChatSession(chat: LeaveChatSessionReq) {
    const {senderId, receiverId} = chat;
    // 移除游标
    ChatMessageDao.sessionCursor.delete(`${ senderId }-${ receiverId }`);
  }
}