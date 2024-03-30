import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/orm';
import { ChatSession } from '@/entities/ChatSession';
import { Repository } from 'typeorm';
import { CHAT_SESSION_NORMAL } from '@/constant/chatConstant';

@Provide()
export class ChatSessionDao {
  @InjectEntityModel(ChatSession)
  private chatSessionModel: Repository<ChatSession>;

  async addChatSession(chatSession: ChatSession) {
    const session = new ChatSession();
    Object.keys(chatSession).forEach(key => {
      session[key] = chatSession[key];
    });
    return await this.chatSessionModel.save(session);
  }

  /**
   * 通过发送者id和接收者id获取聊天会话列表
   * @param senderId
   * @param receiverId
   */
  async getChatSessionBetweenSenderAndReceiverBySenderId(senderId: string, receiverId: string) {
    return await this.chatSessionModel.find({
      where: [
        {senderId, receiverId, status: CHAT_SESSION_NORMAL},
        {senderId: receiverId, receiverId: senderId, status: CHAT_SESSION_NORMAL}
      ],
      order: {updatedAt: 'desc'}
    });
  }

  /**
   * 通过senderId获取会话列表
   * @param senderId
   */
  async getChatSessionBySenderId(senderId: string) {
    return await this.chatSessionModel.find({
      where: {senderId, status: CHAT_SESSION_NORMAL},
      order: {updatedAt: 'desc'}
    });
  }

  /**
   * 获取 sender 作为接收者或者发送者的会话列表
   * @param senderId
   */
  async getChatSessionWorkSenderAndReceiver(senderId: string) {
    return await this.chatSessionModel.find({
      where: [{
        senderId,
        status: CHAT_SESSION_NORMAL
      }, {
        receiverId: senderId,
        status: CHAT_SESSION_NORMAL
      }],
      order: {updatedAt: 'desc'}
    });
  }

  /**
   * 更新会话信息通过 sessionId
   * @param sessionId
   * @param session
   */
  async updateChatSessionBySessionId(sessionId: number, session: ChatSession) {
    const chatSession = await this.chatSessionModel.findOne({
      where: {id: sessionId}
    });
    Object.keys(session).forEach(key => {
      chatSession[key] = session[key];
    });
    return await this.chatSessionModel.save(chatSession);
  }
}