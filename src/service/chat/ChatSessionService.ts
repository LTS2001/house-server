import { Inject, Provide } from '@midwayjs/core';
import { ChatSessionDao } from '@/dao/chat/ChatSessionDao';
import { ChatSession } from '@/entities/ChatSession';
import { LeaveChatSessionReq } from '@/dto/chat/ChatDto';
import { ChatMessageDao } from '@/dao/chat/ChatMessageDao';
import { CHAT_SESSION_LAST, CHAT_SESSION_OFFLINE, CHAT_SESSION_ONLINE } from '@/constant/chatConstant';

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
    const sessionList = await this.chatSessionDao.getChatSessionBetweenSenderAndReceiverBySenderId(senderId, receiverId);
    const chatSessionList = sessionList.filter(item => {
      if (item.senderId === senderId && item.delByReceiver) {
        return true;
      } else if (item.senderId === receiverId && item.delBySender) {
        return true;
      } else {
        return false;
      }
    });
    // 查看 senderId 的会话列表是否正常（会话列表至多一个是正常的）
    let senderNormalSession = chatSessionList.find(c => c.senderId === senderId);
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
      senderNormalSession = await this.chatSessionDao.addChatSession(chatSession);
    }

    // 将 senderNormalSession 改为在线，同时清空未读消息
    const chatSession = new ChatSession();
    chatSession.isOnline = CHAT_SESSION_ONLINE;
    chatSession.unread = 0;
    await this.chatSessionDao.updateChatSessionBySessionId(senderNormalSession.id, chatSession);

    return senderNormalSession;
  }

  /**
   * 删除一个 session 会话
   * @param senderId
   * @param receiverId
   */
  async delChatSession(senderId: string, receiverId: string) {
    // 删除 session 会话记录（由 senderId 发起的 session）
    const delChatSessionList = await this.chatSessionDao.delChatSession(senderId, receiverId);
    console.log(delChatSessionList);
  }

  /**
   * 获取会话列表
   * @param senderId
   */
  async getChatSession(senderId: string) {
    // 查询 senderId 的所有正常的 session 列表
    const sessionList = await this.chatSessionDao.getChatSessionWorkSenderAndReceiver(senderId);
    const lastSessionList = sessionList.filter(s => s.isLast === CHAT_SESSION_LAST);
    const resultSessionList: ChatSession[] = [];
    lastSessionList.forEach(session => {
      if (session.senderId !== senderId) {
        const {senderId, receiverId} = session;
        const currentSession = sessionList.find(s => s.senderId === receiverId && s.receiverId === senderId);
        resultSessionList.push(currentSession);
      } else {
        resultSessionList.push(session);
      }
    });
    return resultSessionList;
  }

  /**
   * 离开会话
   * @param chat
   */
  async leaveChatSession(chat: LeaveChatSessionReq) {
    const {senderId, receiverId} = chat;
    // 更改在线状态，改为离线
    const sessionList = await this.chatSessionDao.getChatSessionBetweenSenderAndReceiverBySenderId(senderId, receiverId);
    const senderSession = sessionList.find(s => s.senderId === senderId);
    const chatSession = new ChatSession();
    chatSession.isOnline = CHAT_SESSION_OFFLINE;
    await this.chatSessionDao.updateChatSessionBySessionId(senderSession.id, chatSession);

    // 移除游标
    ChatMessageDao.sessionCursor.delete(`${ senderId }-${ receiverId }`);
  }
}