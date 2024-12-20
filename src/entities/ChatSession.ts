import { Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EntityModel } from '@midwayjs/orm';
import { ChatMessage } from './ChatMessage';

@EntityModel('chat_session', {schema: 'house'})
export class ChatSession {
  @PrimaryGeneratedColumn({type: 'int', name: 'id', comment: '信息编号'})
  id: number;

  @Column('varchar', {name: 'sender_id', comment: '发送者id', length: 255})
  senderId: string;

  @Column('varchar', {name: 'receiver_id', comment: '接收者id', length: 255})
  receiverId: string;

  @Column('int', {
    name: 'is_online',
    comment: '发送者是否在线：0(不在线)，1(在线)',
    default: () => '\'0\'',
  })
  isOnline: number;

  @Column('int', {
    name: 'is_last',
    comment: 'sender 和 receiver 之间该会话是否是最新：0(否)，1(是)',
    default: () => '\'0\'',
  })
  isLast: number;

  @Column('int', {
    name: 'unread',
    comment: '发送者消息未读数',
    default: () => '\'0\'',
  })
  unread: number;

  @Column('int', {
    name: 'del_by_sender',
    comment: '该聊天会话是否被sender删除：0(已删除)，1(正常)',
    default: () => '\'1\'',
  })
  delBySender: number;

  @Column('int', {
    name: 'del_by_receiver',
    comment: '该聊天会话是否被receiver删除：0(已删除)，1(正常)',
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
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updatedAt: Date;

  @OneToMany(() => ChatMessage, (chatMessage) => chatMessage.chat)
  chatMessages: ChatMessage[];
}
