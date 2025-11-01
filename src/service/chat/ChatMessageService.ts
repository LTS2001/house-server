import { Inject, Provide } from '@midwayjs/core';
import { ChatMessageDao } from '@/dao/chat/ChatMessageDao';
import { AddChatMessageReq, GetChatMessageReq } from '@/dto/chat/ChatDto';
import { ChatMessage } from '@/entities/ChatMessage';
import { ChatSessionDao } from '@/dao/chat/ChatSessionDao';
import { ChatSession } from '@/entities/ChatSession';
import {
  CHAT_SESSION_LAST,
  CHAT_SESSION_NOT_LAST,
} from '@/constant/chatConstant';

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
    const { sessionId, senderId, receiverId, content, type } = chatMessage;
    const sessionList =
      await this.chatSessionDao.getChatSessionBetweenSenderAndReceiverBySenderId(
        senderId,
        receiverId
      );
    // 将之前的 session isLast全部置为 0
    const lastSenderSession = sessionList.find(s => s.senderId === senderId);
    const lastReceiverSession = sessionList.find(
      s => s.senderId === receiverId
    );
    if (!lastSenderSession.isLast && !lastReceiverSession.isLast) {
      sessionList.forEach(s => (s.isLast = CHAT_SESSION_NOT_LAST));
      await this.chatSessionDao.updateChatSession(sessionList);
    }
    // 判断接收者是否在线
    const receiverSession = sessionList.find(s => s.senderId === receiverId);
    const chatSessionReceiver = new ChatSession();
    if (!receiverSession.isOnline) {
      // 接收者不在线，未读消息加一
      chatSessionReceiver.unread = receiverSession.unread + 1;
    }
    chatSessionReceiver.isLast = CHAT_SESSION_NOT_LAST; // 接收者的 session 不是最新的
    await this.chatSessionDao.updateChatSessionBySessionId(
      receiverSession.id,
      chatSessionReceiver
    );

    // 更新 sender 会话日期
    const chatSessionSender = new ChatSession();
    chatSessionSender.isLast = CHAT_SESSION_LAST; // sender session 是最新的
    chatSessionSender.updatedAt = new Date();
    await this.chatSessionDao.updateChatSessionBySessionId(
      sessionId,
      chatSessionSender
    );

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
    const { senderId, receiverId, limit } = chatMessage;

    // 获取 sender 和 receiver 之间的正常的会话列表
    const sessionNormal =
      await this.chatSessionDao.getChatSessionBetweenSenderAndReceiverBySenderId(
        senderId,
        receiverId
      );
    // 查看是否有sender的会话，否则直接返回空数组
    if (sessionNormal.find(s => s.senderId === senderId)) {
      const res = await this.chatMessageDao.getChatMessage({
        senderId,
        receiverId,
        limit,
        session: sessionNormal.map(s => ({
          sessionId: s.id,
          senderId: s.senderId,
          receiverId: s.receiverId,
        })),
      });
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
    const sessionList =
      await this.chatSessionDao.getChatSessionWorkSenderAndReceiver(senderId);
    if (!sessionList.length) return [];
    // 筛选出 sender 和同一个 receiver 中最新的 session 记录
    const lastSessionList = sessionList.filter(s => s.isLast);
    if (!lastSessionList.length) return [];
    return await this.chatMessageDao.getChatSessionLastOneMessageList(
      lastSessionList?.map(l => l.id)
    );
  }

  /**
   * 获取当前 sender 和 receiver 会话的最新消息
   * @param senderId
   * @param receiverId
   */
  async getCurrentChatSessionLastOneMessage(
    senderId: string,
    receiverId: string
  ) {
    const chatSessionList =
      await this.chatSessionDao.getChatSessionBetweenSenderAndReceiverBySenderId(
        senderId,
        receiverId
      );
    const lastSession = chatSessionList.find(
      c => c.isLast === CHAT_SESSION_LAST
    );
    const lastChatMessageList =
      await this.chatMessageDao.getChatSessionLastOneMessageList([
        lastSession.id,
      ]);
    return lastChatMessageList[0];
  }
}
