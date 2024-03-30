import { Column, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, } from 'typeorm';
import { EntityModel } from '@midwayjs/orm';
import { ChatSession } from './ChatSession';

@Index('chat_detail_chat_list_id_fk', ['sessionId'], {})
@EntityModel('chat_message', {schema: 'house'})
export class ChatMessage {
  @PrimaryGeneratedColumn({type: 'int', name: 'id'})
  id: number;

  @Column('int', {name: 'session_id', comment: '会话的id'})
  sessionId: number;

  @Column('varchar', {
    name: 'sender_id',
    comment: '该条信息的发送者id',
    length: 255,
  })
  senderId: string;

  @Column('varchar', {name: 'receiver_id', comment: '接收者id', length: 255})
  receiverId: string;

  @Column('varchar', {name: 'content', comment: '聊天内容', length: 255})
  content: string;

  @Column('int', {
    name: 'type',
    comment: '消息类型：1(文字)，2(图片)，3(视频)',
    default: () => '\'1\'',
  })
  type: number;

  @Column('int', {
    name: 'del_by_sender',
    comment: '该消息是否被发送者删除：0(删除)，1(未删除)',
    default: () => '\'1\'',
  })
  delBySender: number;

  @Column('int', {
    name: 'del_by_receiver',
    comment: '该消息是否被接收者删除：0(删除)，1(未删除)',
    default: () => '\'1\'',
  })
  delByReceiver: number;

  @Column('datetime', {
    name: 'created_at',
    comment: '创建时间',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('datetime', {
    name: 'updated_at',
    comment: '更新时间',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => ChatSession, (chatSession) => chatSession.chatMessages, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{name: 'session_id', referencedColumnName: 'id'}])
  chat: ChatSession;
}
