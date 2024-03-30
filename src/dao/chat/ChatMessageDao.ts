import { Provide } from '@midwayjs/core';
import { ChatMessage } from '@/entities/ChatMessage';
import { InjectEntityModel } from '@midwayjs/orm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { CHAT_MESSAGE_NORMAL } from '@/constant/chatConstant';
import { ToolUtil } from '@/utils/ToolUtil';

@Provide()
export class ChatMessageDao {
  /**
   * 存储聊天会话的游标位置
   */
  static sessionCursor = new Map<string, Date>;

  @InjectEntityModel(ChatMessage)
  private chatMessageModel: Repository<ChatMessage>;

  async addChatMessage(chat: ChatMessage) {
    const chatMessage = new ChatMessage();
    Object.keys(chat).forEach(key => {
      chatMessage[key] = chat[key];
    });
    return await this.chatMessageModel.save(chatMessage);
  }

  /**
   * 获取会话里面的聊天记录
   * @param senderId 当前会话的senderId
   * @param receiverId 当前会话的receiverId
   * @param page 当前页
   * @param limit 一页获取的数据
   * @param session
   */
  async getChatMessage(
    senderId: string,
    receiverId: string,
    page: number,
    limit: number,
    session: { sessionId: number, senderId: string, receiverId: string }[],
  ) {
    // 获取游标
    const cursor = ChatMessageDao.sessionCursor.get(`${ senderId }-${ receiverId }`) || new Date();
    console.log('条件游标', ToolUtil.formatUtcTime(cursor));
    const messageList = await this.chatMessageModel.find({
      where: session.map(s => {
        if (s.senderId === senderId) { // 说明会话是sender发起的
          return {
            ...s,
            delBySender: CHAT_MESSAGE_NORMAL,
            createdAt: LessThanOrEqual(cursor)
          };
        } else { // 否则就是receiver发起的
          return {
            ...s,
            delByReceiver: CHAT_MESSAGE_NORMAL,
            createdAt: LessThanOrEqual(cursor)
          };
        }
      }),
      order: {
        createdAt: 'desc'
      },
      skip: page - 1,
      take: limit
    });
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~', messageList.length);
    if (messageList.length) {
      const date = messageList[messageList.length - 1].createdAt;
      ChatMessageDao.sessionCursor.delete(`${ senderId }-${ receiverId }`);
      // 存储游标，key格式（senderId-receiverId）
      ChatMessageDao.sessionCursor.set(`${ senderId }-${ receiverId }`, date);
      const cursor = ChatMessageDao.sessionCursor.get(`${ senderId }-${ receiverId }`);
      console.log('@@@@@@@@@@@@@@@@cursor', ToolUtil.formatUtcTime(cursor));
    } else {
      console.log('##################################', cursor);

    }
    return messageList;
  }

  /**
   * 获取会话列表的最新一条消息
   * @param sessionIdList
   */
  async getChatSessionLastOneMessageList(sessionIdList: number[]) {
    const latestRecords = await this.chatMessageModel
      .createQueryBuilder('chat')
      .select('chat.session_id')
      .addSelect('MAX(chat.updated_at)', 'max_updated_at')
      .where('chat.session_id IN (:...sessionIds)', {sessionIds: sessionIdList})
      .groupBy('chat.session_id')
      .getRawMany();

    return await this.chatMessageModel.find({
      where: latestRecords.map(r => ({sessionId: r.session_id, updatedAt: r.max_updated_at}))
    });
  }
}