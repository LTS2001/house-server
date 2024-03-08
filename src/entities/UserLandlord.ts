import { Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EntityModel } from '@midwayjs/orm';
import { Comment } from './Comment';

@EntityModel('user_landlord', {schema: 'house'})
export class UserLandlord {
  @PrimaryGeneratedColumn({type: 'int', name: 'id'})
  id: number;

  @Column('varchar', {name: 'name', comment: '用户名称', length: 255})
  name: string;

  @Column('varchar', {
    name: 'remark',
    nullable: true,
    comment: '备注',
    length: 255,
  })
  remark: string | null;

  @Column('varchar', {name: 'phone', comment: '手机号', length: 255})
  phone: string;

  @Column('varchar', {
    name: 'open_id',
    nullable: true,
    comment: '微信openId',
    length: 255,
  })
  openId: string | null;

  @Column('varchar', {
    name: 'union_id',
    nullable: true,
    comment: '微信unionId',
    length: 255,
  })
  unionId: string | null;

  @Column('varchar', {
    name: 'session_key',
    nullable: true,
    comment: '微信sessionKey',
    length: 255,
  })
  sessionKey: string | null;

  @Column('int', {
    name: 'source_type',
    nullable: true,
    comment: '用户来源->1：微信',
  })
  sourceType: number | null;

  @Column('int', {
    name: 'status',
    nullable: true,
    comment: '状态->1：正常，2：停用，3：删除',
    default: () => '\'1\'',
  })
  status: number | null;

  @Column('varchar', {
    name: 'head_img',
    nullable: true,
    comment: '头像',
    length: 510,
  })
  headImg: string | null;

  @Column('datetime', {
    name: 'created_at',
    nullable: true,
    comment: '创建日期',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;

  @Column('datetime', {
    name: 'updated_at',
    nullable: true,
    comment: '最近更新日期',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date | null;

  @OneToMany(() => Comment, (comment) => comment.landlord_)
  comments: Comment[];
}
